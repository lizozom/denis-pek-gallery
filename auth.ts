import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
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

        const username = credentials.username as string;
        const password = credentials.password as string;

        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        console.log('Auth attempt for username:', username);

        if (!adminPasswordHash) {
          console.error('ADMIN_PASSWORD_HASH not configured');
          return null;
        }

        if (username !== adminUsername) {
          console.error('Username does not match');
          return null;
        }

        const isValidPassword = await bcrypt.compare(password, adminPasswordHash);

        if (!isValidPassword) {
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
