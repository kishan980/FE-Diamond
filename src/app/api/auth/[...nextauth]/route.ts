import NextAuth from 'next-auth';
import { authOptions } from 'utils/authOptions';

// ==============================|| NEXT AUTH - ROUTES  ||============================== //

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
