import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error('Missing username or password');
          return null;
        }

        const { username, password } = credentials;

        // Check against hardcoded credentials for now
        // TODO: Fix env variable loading issue with bcrypt hashes containing $
        const adminUsername = 'admin';
        const adminPassword = 'admin123';

        console.log('Auth attempt for username:', username);

        if (username !== adminUsername) {
          console.error('Username does not match');
          return null;
        }

        if (password !== adminPassword) {
          console.error('Invalid password');
          return null;
        }

        console.log('Auth successful!');
        return {
          id: '1',
          name: 'Admin',
          email: adminUsername,
        };
      },
    }),
  ],
});
