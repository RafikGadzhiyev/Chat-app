import { createGlobalStyle } from 'styled-components';
import { Roboto } from '@next/font/google'
import type { AppProps } from 'next/app'

const roboto = Roboto({
  style: ['italic', 'normal'],
  subsets: ['latin'],
  weight: '400'
});

const GlobalStyles = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }

  html,
  body {
    width: 100%;
    min-height: 100vh;
    font-size: 20px;
    box-sizing: border-box;
    font-family: ${roboto.style.fontFamily}
  }

  a{ 
    text-decoration: none;
  }

  button {
    all: unset;
    cursor: pointer
  }

  ul,
  ol {
    list-style: none;
  }
`

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <GlobalStyles />
    <Component {...pageProps} />
  </>
}
