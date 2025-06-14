import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import durationPlugin from 'dayjs/plugin/duration';
import {FilterType} from './const.js';

dayjs.extend(durationPlugin);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const now = dayjs();

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }
  if (dateA === null) {
    return 1;
  }
  if (dateB === null) {
    return -1;
  }
  return null;
};

const sortPointsByDay = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);
  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

const sortPointsByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
};

const sortPointsByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const formatDateToMonthDay = (date) => {
  if (!date) {
    return '';
  }
  return dayjs(date).format('MMM DD');
};

const formatTimeToHourMinute = (date) => {
  if (!date) {
    return '';
  }
  return dayjs(date).format('HH:mm');
};

const formatDuration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const diff = end.diff(start);

  if (diff <= 0) {
    return '00M';
  }

  const eventDuration = dayjs.duration(diff);

  const days = eventDuration.days();
  const hours = eventDuration.hours();
  const minutes = eventDuration.minutes();

  if (days > 0) {
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  return `${String(minutes).padStart(2, '0')}M`;
};


const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(now)),
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs(point.dateFrom).isSameOrBefore(now) && dayjs(point.dateTo).isSameOrAfter(now)),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo).isBefore(now)),
};

export const escapeHtml = (unsafe) => {
  if (unsafe === null || typeof unsafe === 'undefined') {
    return '';
  }
  if (typeof unsafe === 'number') {
    return String(unsafe);
  }
  if (typeof unsafe !== 'string') {
    unsafe = String(unsafe);
  }

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const isValidImageUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }
  return url.startsWith('http://') || url.startsWith('https://') || (!url.startsWith('//') && !url.includes(':'));
};

export const generateRandomString = (length = 12) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};

export {
  sortPointsByDay,
  sortPointsByTime,
  sortPointsByPrice,
  formatDateToMonthDay,
  formatTimeToHourMinute,
  formatDuration,
  filter,
};
