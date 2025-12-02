import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { EventServices } from 'services/event/event.services';
import { MinesData } from 'services/event/types';

export const useMinesData = () => {
  const [mineData, setMineData] = useState<MinesData[]>([]);
  const [isMineLoading, setIsMineLoading] = useState(false);

  const fetchMineData = useCallback(async () => {
    setIsMineLoading(true);
    try {
      const minesData = await EventServices.minesListData();
      if (typeof minesData !== 'string' && minesData.success) {
        setMineData(minesData.data);
      } else {
        throw new Error('Mines data fetch failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching mine data:', error);
      toast.error('Failed to fetch mine data');
    } finally {
      setIsMineLoading(false);
    }
  }, []);

  return { mineData, isMineLoading, fetchMineData };
};
