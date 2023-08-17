import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import MySQL from 'mysql2/promise';

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Connect to your MySQL database
        const connection = await MySQL.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });

        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND password = ?', [credentials.username, credentials.password]);

        connection.end();

        if (rows.length > 0) {
          // If the credentials are valid, return the user object
          return { id: rows[0].id, name: rows[0].name, email: rows[0].email };
        } else {
          // If the credentials are invalid, throw an error
          throw new Error('Invalid username or password');
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  secret: process.env.JWT_SECRET,

  callbacks: {
    redirect: async () => {
      return Promise.resolve('/user/profile');
    },
  },
});