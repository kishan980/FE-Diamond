'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Loader from 'components/Loader';
import { GuardProps } from 'types/auth';
import { ALLOWED_ENTITY_TYPES } from 'constants/auth.constants';

const UserGuard = ({ children }: GuardProps) => {
  const { data: session, status } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const entityTypeID = imageDetails?.currentUserDetails?.entityTypeID;

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!session?.user) {
        router.replace('/');
        return;
      }

      const res = await fetch('/api/auth/protected');
      const json = await res.json();
      const tokenExpiry = session?.user?.image ? JSON.parse(session.user.image).expiry : null;

      if (!json?.protected || (tokenExpiry && tokenExpiry < Date.now() / 1000)) {
        await signOut({ redirect: false });
        router.replace('/');
      }
    };

    if (status !== 'loading') checkAuth();
  }, [session, status, router]);

  if (status === 'loading' || !session?.user) return <Loader />;

  return !ALLOWED_ENTITY_TYPES.includes(entityTypeID) ? <>{children}</> : null;
};

export default UserGuard;
