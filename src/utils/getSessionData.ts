import { getSession } from 'next-auth/react';
import { getAuthUser } from './authOptions';

export const getUserDataClient = async () => {
  const session = await getSession();
  const details = session?.user?.image;

  return details ? JSON.parse(details) : null;
};

export const getUserDataServer = async () => {
  const session = await getAuthUser();
  const details = session?.user?.image;

  return details ? JSON.parse(details) : null;
};

export const getUserTokenServer = async () => {
  const details = await getUserDataServer();
  return details.token;
};

export const getUserTokenClient = async () => {
  const details = await getUserDataClient();
  return details.token;
};
