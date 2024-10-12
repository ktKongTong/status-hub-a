export const convertTimeToShortStr = (time: number)=> {
  if(time <= 30 * 24 * 3600) {
    return '30d';
  }else if(time <= 60 * 24 * 3600) {
    return '60d';
  }else if(time <= 90 * 24 * 3600) {
    return '90d';
  }else if(time <= 365 * 24 * 3600) {
    return '365d';
  }
  return 'never';
}
export const convertShortStrToTime = (str: string)=> {
  if(str === 'never') {
    return Number.MAX_VALUE
  }else if(str === '365d') {
    return 365 * 24 * 3600
  }else if(str === '90d') {
    return 90 * 24 * 3600
  }else if(str === '60d') {
    return 60 * 24 * 3600
  }
  return 30 * 24 * 3600
}