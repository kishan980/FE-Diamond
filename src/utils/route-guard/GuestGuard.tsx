'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loader from 'components/Loader';
import { GuardProps } from 'types/auth';
import { ALLOWED_ENTITY_TYPES } from 'constants/auth.constants';

const GuestGuard = ({ children }: GuardProps) => {
  const { data: session, status } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const entityTypeID = imageDetails?.currentUserDetails?.entityTypeID;
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && session?.user) router.replace(ALLOWED_ENTITY_TYPES.includes(entityTypeID) ? '/events' : '/bidder');
  }, [session, status, router, entityTypeID]);

  if (status === 'loading' || session?.user) return <Loader />;

  return <>{children}</>;
};

export default GuestGuard;
