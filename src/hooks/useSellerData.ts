import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { EventServices } from 'services/event/event.services';
import { EventOrganizedForData } from 'services/event/types';

type SellerFetchType = 'Selected' | 'All';

export const useSellerData = () => {
  const [sellerData, setSellerData] = useState<EventOrganizedForData[]>([]);
  const [isSellerLoading, setIsSellerLoading] = useState(false);

  const fetchSellerData = useCallback(async (type: SellerFetchType = 'Selected') => {
    setIsSellerLoading(true);
    try {
      const response = await EventServices.getEventSellerType(type);
      if (typeof response !== 'string' && response.success) {
        setSellerData(response.data);
      } else {
        throw new Error('Failed to fetch seller data');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching seller data:', error);
      toast.error('Failed to fetch seller data');
    } finally {
      setIsSellerLoading(false);
    }
  }, []);

  return { sellerData, isSellerLoading, fetchSellerData };
};
