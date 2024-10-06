const humanize = (times: string[]) => {
  const [delimiter, separator] = [',', '.'];
  const orderTimes = times.map((v) => v.replaceAll(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + delimiter));
  return orderTimes.join(separator);
};

export const time = (start: number) => {
  const delta = Date.now() - start;
  return humanize([delta < 1000 ? delta + 'ms' : Math.round(delta / 1000) + 's']);
};