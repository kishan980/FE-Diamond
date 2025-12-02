import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isValid from 'date-fns/isValid';
import isYesterday from 'date-fns/isYesterday';
import parse from 'date-fns/parse';

export const formatTimeRemaining = (diff: number) => {
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    .toString()
    .padStart(2, '0');
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((diff / 1000) % 60)
    .toString()
    .padStart(2, '0');
  return `${days} : ${hours} : ${minutes} : ${seconds}`;
};

export const formatDurationFromMs = (timeDifference: number) => {
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    .toString()
    .padStart(2, '0');
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((timeDifference / 1000) % 60)
    .toString()
    .padStart(2, '0');

  return `${days} ${hours} ${minutes} ${seconds}`;
};

export const formatDateAndTime = (isoString: string | null | undefined): string => {
  if (!isoString) return '-';
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = String(date.toLocaleDateString(undefined, { month: 'long' }));
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;

  return `${day} ${month} ${year} ${adjustedHours}:${minutes} ${ampm}`;
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = String(date.toLocaleDateString(undefined, { month: 'short' }));
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${day} ${month} ${year}`;
};

export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);

  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;

  return `${adjustedHours}:${minutes} ${ampm}`;
};

export const formatHMSDuration = (diff: number) => {
  const hours = Math.floor(diff / (1000 * 60 * 60))
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((diff / 1000) % 60)
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleString('en-GB', options).replace(',', '');
};

export const formatMessageTime = (timestamp: string | Date): string => {
  let date: Date;

  if (typeof timestamp === 'string') {
    const cleanString = timestamp.replace(/\s+/g, ' ').trim();
    date = parse(cleanString, 'MMM d yyyy h:mmaaa', new Date());
  } else {
    date = new Date(timestamp);
  }

  if (!isValid(date)) return '';

  return format(date, 'p');
};

export const getDayLabel = (timestamp: string | Date): string => {
  let date: Date;

  if (typeof timestamp === 'string') {
    const cleanString = timestamp.replace(/\s+/g, ' ').trim();
    date = parse(cleanString, 'MMM d yyyy h:mmaaa', new Date());
  } else {
    date = new Date(timestamp);
  }

  if (!isValid(date)) return '';

  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';

  return format(date, 'dd/MM/yyyy');
};
