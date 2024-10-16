


export const humanize = (times: string[]) => {
  const [delimiter, separator] = [',', '.'];
  const orderTimes = times.map((v) => v.replaceAll(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + delimiter));
  return orderTimes.join(separator);
};

export const time = (start: number) => {
  const delta = Date.now() - start;
  return humanize([delta < 1000 ? delta + 'ms' : Math.round(delta / 1000) + 's']);
};

export const timestamp = (start?: number | string | Date | undefined) => {
  if (start instanceof Date) {
    return Math.floor(start.getTime() / 1000);
  }
  if(start === undefined) {
    return Math.floor(Date.now() / 1000);
  }
  if(typeof start === 'string') {
    const date = start ? new Date(start) : new Date();
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string provided');
    }
    return Math.floor(date.getTime()/1000)
  }
  if(typeof start === 'number' && !Number.isNaN(start)) {
    if((start as number) > 2e10) {
      return Math.floor((start as number)/1000)
    }
    return Math.floor((start as number))
  }
  throw new Error('Invalid input type');
};

import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from "dayjs";
dayjs.extend(relativeTime);

export const formatRelativeTimeToNow = (time: string) => {
  return dayjs().to(dayjs(time))
}