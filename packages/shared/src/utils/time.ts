

const humanize = (times: string[]) => {
  const [delimiter, separator] = [',', '.'];
  const orderTimes = times.map((v) => v.replaceAll(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + delimiter));
  return orderTimes.join(separator);
};

export const time = (start: number) => {
  const delta = Date.now() - start;
  return humanize([delta < 1000 ? delta + 'ms' : Math.round(delta / 1000) + 's']);
};

export const timestamp = (start: number | string | undefined) => {
  if(!Number.isNaN(start)) {
    if((start as number) > 2e9) {
      return Math.ceil((start as number)/1000)
    }
  }
  const date = start ? new Date(start) : new Date();
  return Math.ceil(date.getTime()/1000)
};

import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from "dayjs";
dayjs.extend(relativeTime);

export const formatRelativeTimeToNow = (time: string) => {
  return dayjs().to(dayjs(time))
}