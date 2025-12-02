import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession, type NextAuthOptions, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthServices } from 'services/authuser/authuser.services';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        userName: { name: 'userName', label: 'Username', type: 'text', placeholder: 'Enter Username' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' },
        token: { name: 'token', label: 'Token', type: 'text', placeholder: 'Enter token' },
      },
      async authorize(credentials) {
        try {
          const { userName = '', password = '', token = '' } = credentials ?? {};
          const user = await AuthServices.loginUser({ userName, password, token });

          if (user && typeof user !== 'string') {
            if (user.success) {
              user.data.accessToken = user.data.token;

              return {
                id: user.data.currentUserDetails.entityID.toString(),
                name: user.data.currentUserDetails.eventCompanyName,
                email: user.data.currentUserDetails.username,
                image: JSON.stringify(user.data),
              } as User;
            } else {
              throw new Error(user.error || 'Login failed');
            }
          }
          return null;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Error in authOptions', e);
          throw new Error(e as string);
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        // @ts-expect-error
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.token = token;
        session.isAdmin = session.user?.email === 'admin';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT),
  },
  jwt: { secret: process.env.NEXT_APP_JWT_SECRET },
  pages: { signIn: '/' },
};

export function getAuthUser( // <-- use this function to access the jwt from React components
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  return getServerSession(...args, authOptions);
}
