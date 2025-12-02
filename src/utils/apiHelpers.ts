import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { LoadingState } from 'types/table';

export const handleFetchData = async <T>(
  serviceCall: () => Promise<{ success: boolean; data: T } | string>,
  setStateFn: Dispatch<SetStateAction<T>>,
  loadingSetter: Dispatch<SetStateAction<LoadingState>>
) => {
  loadingSetter((prev) => ({ ...prev, isProgress: true, isTimerLoading: true }));
  try {
    const response = await serviceCall();

    if (typeof response !== 'string' && response.success) {
      setStateFn(response.data);
    } else {
      toast.error('Failed to load data.');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching data:', error);
    toast.error('Error fetching data.');
  } finally {
    loadingSetter((prev) => ({ ...prev, isProgress: false, isTimerLoading: false }));
  }
};
