import { useSession } from 'next-auth/react';

interface UserProps {
  name: string;
  email: string;
  avatar: string;
  thumb: string;
  role: string;
}

const useUser = (): UserProps | false => {
  const { data: session } = useSession();

  if (!session || !session.user) return false;

  const user = { ...session.user };
  const { provider } = session;
  let thumb = user.image ?? '/assets/images/users/avatar-thumb-1.png';

  if (provider === 'cognito' && user.email) {
    const emailParts = user.email.split('@');
    user.name = emailParts[0] || 'John Doe';
  }

  if (!user.image) {
    user.image = '/assets/images/users/avatar-1.png';
    thumb = '/assets/images/users/avatar-thumb-1.png';
  }

  const newUser: UserProps = {
    name: user.name || 'John Doe',
    email: user.email || 'no-email@example.com',
    avatar: user.image,
    thumb,
    role: 'UI/UX Designer',
  };

  return newUser;
};

export default useUser;
