import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

console.log("Google Client ID: ", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret: ", process.env.GOOGLE_CLIENT_SECRET);
console.log("JWT Secret: ", process.env.JWT_SECRET);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  
  secret: process.env.JWT_SECRET
});