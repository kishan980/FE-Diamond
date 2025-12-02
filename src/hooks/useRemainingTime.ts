import { useEffect, useState } from 'react';
import { parseISO } from 'date-fns';
import { formatDurationFromMs } from 'utils/format-date';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';

export const useRemainingTime = (eventTenderData: GetViewParticipateData[]) => {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const calculateRemainingTime = () => {
      const [event] = eventTenderData;

      const startTime = event?.startDate ? parseISO(event.startDate).getTime() : null;
      const endTime = event?.tenderenddate ? parseISO(event.tenderenddate).getTime() : null;
      const auctionStartTime = event?.Auctionstartdate ? parseISO(event.Auctionstartdate).getTime() : null;
      const auctionEndTime = event?.Auctionenddate ? parseISO(event.Auctionenddate).getTime() : null;

      if (!startTime || !endTime || !auctionStartTime || !auctionEndTime) {
        setRemainingTime('');
        return;
      }

      const currentTime = Date.now();
      const adjustedCurrentTime = currentTime + 5.5 * 60 * 60 * 1000;

      let status = '';

      if (adjustedCurrentTime < startTime) {
        status = 'Not Open Yet';
      } else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < endTime) {
        status = formatDurationFromMs(endTime - adjustedCurrentTime);
      } else if (auctionStartTime !== null && adjustedCurrentTime >= endTime && adjustedCurrentTime < auctionStartTime) {
        if (event.EventType === 'Tender') {
          status = 'Closed';
        } else if (event.EventType === 'Auction' || event.EventType === 'Mixed') {
          status = 'Tender & pre-auction submission period is closed.';
        } else {
          status = 'Closed';
        }
      } else if (auctionStartTime !== null && adjustedCurrentTime >= auctionStartTime && adjustedCurrentTime < auctionEndTime) {
        if ((event.EventType === 'Auction' || event.EventType === 'Mixed') && event.EventRound === 'Auction') {
          status = 'Auction is ongoing';
        } else if (event.EventType === 'Tender' && event.EventRound === 'Auction') {
          status = 'Closed';
        }
      } else if (adjustedCurrentTime >= auctionEndTime) {
        status = 'Closed';
      }

      setRemainingTime(status);
    };

    calculateRemainingTime();
    const intervalId = setInterval(calculateRemainingTime, 1000);
    return () => clearInterval(intervalId);
  }, [eventTenderData]);

  return remainingTime;
};
