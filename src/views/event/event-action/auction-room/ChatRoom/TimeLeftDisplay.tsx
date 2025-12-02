'use client';
import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseSquare } from 'iconsax-react';
import { TimeLeftBox } from './ChatRoom.styled';

const formatTime = (ms: number) => {
  const hours = String(Math.floor(ms / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  const seconds = String(Math.floor((ms % (1000 * 60)) / 1000)).padStart(2, '0');
  return { hours, minutes, seconds };
};

const parseDuration = (duration: string): number => {
  const [hh = '0', mm = '0', ss = '0'] = duration.split(':');
  const totalMs = parseInt(hh) * 60 * 60 * 1000 + parseInt(mm) * 60 * 1000 + parseInt(ss) * 1000;
  return totalMs;
};

const FlipDigit = ({ value }: { value: string }) => (
  <motion.div
    key={value}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 20, opacity: 0 }}
    transition={{ duration: 0.25 }}
    style={{
      fontSize: '2rem',
      fontWeight: 600,
      minWidth: '3.5rem',
      textAlign: 'center',
      color: '#1e88e5',
      background: '#e3f2fd',
      borderRadius: '8px',
      paddingTop: '4px',
      paddingBottom: '4px',
      paddingLeft: '6px',
      paddingRight: '6px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      whiteSpace: 'nowrap',
    }}
  >
    {value}
  </motion.div>
);

const TimeSegment = ({ label, value }: { label: string; value: string }) => (
  <Stack spacing={0.5} alignItems="center">
    <AnimatePresence mode="wait">
      <FlipDigit value={value} />
    </AnimatePresence>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Stack>
);

const TimeLeftDisplay = ({ status, endTime }: { status: 'Closed' | 'countdown'; endTime?: string }) => {
  const [time, setTime] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    if (status !== 'countdown' || !endTime) return;

    const durationMs = parseDuration(endTime);
    const endTimestamp = Date.now() + durationMs;

    const updateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, endTimestamp - now);
      setTime(formatTime(diff));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [status, endTime]);

  const getStatusDisplay = () => {
    if (status === 'Closed') {
      return (
        <Stack spacing={1} alignItems="center">
          <CloseSquare size="35" color="#FF0000" />
          <Typography variant="h6" color="error">
            Closed
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack direction="row" spacing={2} justifyContent="center">
        <TimeSegment label="Hours" value={time.hours} />
        <TimeSegment label="Minutes" value={time.minutes} />
        <TimeSegment label="Seconds" value={time.seconds} />
      </Stack>
    );
  };

  return (
    <TimeLeftBox>
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Time Left
      </Typography>
      {getStatusDisplay()}
    </TimeLeftBox>
  );
};

export default TimeLeftDisplay;
