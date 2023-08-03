require('dotenv').config()

import '/styles/globals.css'
import '/styles/authForms.module.css'
import {SessionProvider} from 'next-auth/react'

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
