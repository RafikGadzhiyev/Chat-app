import React from 'react';
import { v4 as uuid4 } from 'uuid'
import styled from 'styled-components'
import io, { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { IUser } from '../utils/types';

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 95vh;
  width: 100%;
`;

const NameForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`

const NameField = styled.input`
  all: unset;
  cursor: text;
  border-radius: 5px;
  border: 1px solid #ccc;
  transition: 300ms;
  padding: 5px 10px;
  
  &:focus{ 
    border-color: #000;
  }
  
  `;

const SendButton = styled.button`
  all: unset;
  cursor: pointer;
  border-radius: 5px;
  background-color: #9caccc;
  transition: 300ms;
  color: #fff;
  padding: .5rem 1rem;

  &:hover {
    background-color: #44aacc;
  }

`

const UsersListContainer = styled.div`
  position: fixed;
  top: 0;
  left:0;
  width: 300px;
  height: 100vh;
  border-radius: 0 5px 5px 0;
  background-color: rgb(155 143 166 / 1);
  padding-top: 25px;
`;

const UsersList = styled.ul`
  display: flex;
  list-style: none;
  flex-direction: column;
  gap: 5px;
  width: inherit;
`

const User = styled.li`
  width: inherit;
`

const ChooseUserButton = styled.button`
  all: unset;
  width: inherit;
  cursor: pointer;
  padding: 5px 15px;
  transition: 300ms ease;

  &:hover {
    background-color: rgb(255 255 255 / .4);
  }

`

export default function Home() {
  const socket = React.useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const connectionTimes = React.useRef<number>(1);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const nameFieldRef = React.useRef<HTMLInputElement | null>(null);

  const runSocket = async () => {
    await fetch('/api/socket');
    socket.current = io();
    socket.current.on('connect', () => console.log('Connected!'));
    socket.current.on("connect_error", (err) => {
      if (err.message === 'Invalid username') {
        alert("Invalid username! Try again")
      }
    })

    socket.current.on('users', (connectedUsers) => {
      setUsers(() => connectedUsers)
      console.log(connectedUsers);
    })
    socket.current.on("user connected", (userData) => {
      console.log("New user has connected");
      setUsers((prev) => [...prev, userData]);
      console.log(userData);
    })
  }

  const onSubmitHandler = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    // await runSocket();
    if (socket.current) {
      socket.current.auth = { username: nameFieldRef.current?.value };
      socket.current.connect();
    }
  }

  React.useEffect(() => {
    if (connectionTimes.current || socket.current === null) {
      connectionTimes.current--;
      runSocket();
    }
    return;
  }, [])

  return (
    <MainContainer>
      <UsersListContainer>
        <UsersList>
          {
            users.map((user: IUser) => <User key={uuid4()}><ChooseUserButton>{user.username}</ChooseUserButton></User>)
          }
        </UsersList>
      </UsersListContainer>
      <NameForm
        onSubmit={(e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => onSubmitHandler(e)}
      >
        <NameField
          as={NameField}
          ref={nameFieldRef}
        />
        <SendButton>
          Create a room
        </SendButton>

      </NameForm>
    </MainContainer>
  )
}
