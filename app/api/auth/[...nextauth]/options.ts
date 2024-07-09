import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/ui_routes/check_company`, {
            email: credentials.email,
          });
          
          if (response.status === 200 && response.data.exists) {
            return { id: credentials.email, email: credentials.email, companyExists: true, token: response.data.token };
          } else if (response.status === 403) {
            return { id: credentials.email, email: credentials.email, companyExists: false };
          } else {
            return null;
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
              throw new Error('Email does not exist');
            }
            console.error('Error checking company:', error.response?.data);
          } else {
            console.error('Error checking company:', error);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/ui_routes/check_company`, {
            email: user.email,
          });
          
          if (response.status === 200) {
            user.companyExists = true;
            user.token = response.data.token;
          } else if (response.status === 403) {
            user.companyExists = false;
          }
        } catch (error) {
          console.error('Error checking company:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.companyExists = user.companyExists;
        token.authToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.companyExists = token.companyExists as boolean;
        session.user.authToken = token.authToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith('/')) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};