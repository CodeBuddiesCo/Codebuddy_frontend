import '/styles/globals.css'
import '/styles/authForms.module.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId="716494370128-79qffo5l6h956ds42lkgt74c62ntk1qf.apps.googleusercontent.com">
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
