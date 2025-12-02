import { toast } from 'react-toastify';
import { getUserDataClient } from './getSessionData';
import { LoadingState, SetLoadingFn } from 'types/table';

export const checkDownloadAccess = async (setIsDownloadAccess: (value: boolean) => void, setLoading?: SetLoadingFn) => {
  if (setLoading) setLoading((prev) => ({ ...prev, isProgress: true }));

  try {
    const userData = await getUserDataClient();
    setIsDownloadAccess(userData.currentUserDetails.isDownloadAccess);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching user data checkDownloadAccess:', error);
    toast.error('Error fetching user data:');
  } finally {
    if (setLoading) setLoading((prev: LoadingState) => ({ ...prev, isProgress: false }));
  }
};

export const checkPasswordProtection = async (setIsPassword: (value: boolean) => void) => {
  try {
    const userData = await getUserDataClient();
    setIsPassword(userData.currentUserDetails.isPassword);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching user data checkPasswordProtection:', error);
    toast.error('Error fetching user data:');
  }
};
