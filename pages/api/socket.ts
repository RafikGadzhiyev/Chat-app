import { Socket } from 'dgram';
import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';
import { Server as IOserver } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next';



interface ISocketServer extends HTTPServer {
    io?: IOserver
}

interface ISocketWithIO extends NetSocket {
    server: ISocketServer
}

interface NextApiResponseWithIOServer extends NextApiResponse {
    socket: ISocketWithIO
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithIOServer) {
    try {
        if (res.socket && res.socket.server.io) {
            console.log("Server is already running!")
        } else {
            console.log('Server initialization');
            const io = new IOserver(res.socket.server);
            io.use((socket, next) => {
                const userName = socket.handshake.auth.username;
                if (!userName) {
                    return next(new Error("Invalid username"));
                }
                (socket as any).username = userName;
                next();
            })
            io.on('connection', (socket) => {
                const connectedUsers = [];
                for (let [id, sock] of io.of("/").sockets) {
                    connectedUsers.push({
                        userId: id,
                        username: (sock as any).username
                    })
                }

                socket.emit("users", connectedUsers);
                socket.broadcast.emit("user connected", {
                    userId: socket.id,
                    username: (socket as any).username
                })
            })
            res.socket.server.io = io;
        }

        res.end();
    } catch (e: any) {
        res.status(400).json(e);
    }
}