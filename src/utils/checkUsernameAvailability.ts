import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { LoadingState } from 'types/table';

export const checkUsernameAvailability = async (
  username: string,
  serviceMethod: (username: string) => Promise<any>,
  setLoading: Dispatch<SetStateAction<LoadingState>>
) => {
  setLoading((prev) => ({ ...prev, isCircularLoading: true }));

  if (!username.trim()) {
    toast.error('Enter a username');
    setLoading((prev) => ({ ...prev, isCircularLoading: false }));

    return;
  }

  try {
    const res = await serviceMethod(username);
    if (typeof res !== 'string' && res.success) toast.success(`You can continue with username ${username}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error checking username availability', error);
    toast.error('Error checking username availability');
  } finally {
    setLoading((prev) => ({ ...prev, isCircularLoading: false }));
  }
};
