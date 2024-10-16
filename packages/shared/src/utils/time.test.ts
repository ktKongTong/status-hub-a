import {afterEach, assert, beforeEach, describe, expect, it, test, vi} from "vitest";
import {formatRelativeTimeToNow, humanize, time, timestamp} from "./time";


describe('humanize function', () => {
  it('should format a single number correctly', () => {
    expect(humanize(['1000'])).toBe('1,000');
  });

  it('should format multiple numbers correctly', () => {
    expect(humanize(['1000', '2000', '3000'])).toBe('1,000.2,000.3,000');
  });

  it('should handle numbers less than 1000', () => {
    expect(humanize(['500'])).toBe('500');
  });

  it('should handle large numbers', () => {
    expect(humanize(['1000000'])).toBe('1,000,000');
  });

  it('should handle mixed numbers', () => {
    expect(humanize(['1000', '500', '1000000'])).toBe('1,000.500.1,000,000');
  });
});

describe('time function', () => {
  it('should return time in milliseconds for durations less than 1 second', () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.advanceTimersByTime(500);
    expect(time(start)).toBe('500ms');
    vi.useRealTimers();
  });

  it('should return time in seconds for durations of 1 second or more', () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.advanceTimersByTime(1500);
    expect(time(start)).toBe('2s');
    vi.useRealTimers();
  });

  it('should handle durations of exactly 1 second', () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.advanceTimersByTime(1000);
    expect(time(start)).toBe('1s');
    vi.useRealTimers();
  });

  it('should handle long durations', () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.advanceTimersByTime(3600000); // 1 hour
    expect(time(start)).toBe('3,600s');
    vi.useRealTimers();
  });
});

describe('timestamp function', () => {

  test("tran-timestamp", async () => {
    const start = Date.now();
    const res = timestamp(start)
    assert.equal(res, Math.floor(start/1000))
  })

  it("tran-timestamp-date", () => {
    const start = new Date()
    const res = timestamp(start)
    assert.equal(res, Math.floor(start.getTime()/1000))
  })

  it("tran-timestamp-string", () => {
    const start = new Date()
    const res = timestamp(start.toString())
    assert.equal(res, Math.floor(start.getTime()/1000))
  })

  it("tran-timestamp-now", () => {
    const start = new Date()
    const res = timestamp()
    assert.approximately(res, Math.floor(start.getTime()/1000), 1)
  })
  it('should return current timestamp when no argument is provided', () => {
    const result = timestamp();
    const now = Math.floor(Date.now() / 1000);
    expect(result).to.be.closeTo(now, 1);
  });

  it('should handle number input (seconds)', () => {
    const secondsTimestamp = 1635724800; // 2021-11-01 00:00:00 UTC
    expect(timestamp(secondsTimestamp)).toBe(secondsTimestamp);
  });

  it('should handle number input (milliseconds)', () => {
    const millisecondsTimestamp = 1635724800000; // 2021-11-01 00:00:00 UTC
    expect(timestamp(millisecondsTimestamp)).toBe(1635724800);
  });

  it('should handle Date object input', () => {
    const date = new Date('2021-11-01T00:00:00Z');
    expect(timestamp(date)).toBe(1635724800);
  });

  it('should handle string input', () => {
    expect(timestamp('2021-11-01T00:00:00Z')).toBe(1635724800);
  });

  it('should throw an error for invalid input', () => {
    expect(() => timestamp('invalid date')).toThrow('Invalid date string provided');
    expect(() => timestamp({} as any)).toThrow('Invalid input type');
  });

  it('should handle edge cases', () => {
    expect(timestamp(0)).toBe(0);
    expect(timestamp('1970-01-01T00:00:00Z')).toBe(0);
  });

  it('should handle future dates', () => {
    const futureDate = new Date('2050-01-01T00:00:00Z');
    expect(timestamp(futureDate)).toBe(2524608000);
  });
});

describe('formatRelativeTimeToNow', () => {
  beforeEach(() => {
    // Set the mocked current time before each test
    vi.useFakeTimers({ now: new Date('2023-05-15T12:00:00Z') });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return "a few seconds ago" for very recent times', () => {
    const result = formatRelativeTimeToNow('2023-05-15T11:59:55Z');
    expect(result).toBe('a few seconds ago');
  });

  it('should return "in a few seconds" for very near future times', () => {
    const result = formatRelativeTimeToNow('2023-05-15T12:00:05Z');
    expect(result).toBe('in a few seconds');
  });

  it('should return "5 minutes ago" for a time 5 minutes in the past', () => {
    const result = formatRelativeTimeToNow('2023-05-15T11:55:00Z');
    expect(result).toBe('5 minutes ago');
  });

  it('should return "in 5 minutes" for a time 5 minutes in the future', () => {
    const result = formatRelativeTimeToNow('2023-05-15T12:05:00Z');
    expect(result).toBe('in 5 minutes');
  });

  it('should return "an hour ago" for a time 1 hour in the past', () => {
    const result = formatRelativeTimeToNow('2023-05-15T11:00:00Z');
    expect(result).toBe('an hour ago');
  });

  it('should return "in an hour" for a time 1 hour in the future', () => {
    const result = formatRelativeTimeToNow('2023-05-15T13:00:00Z');
    expect(result).toBe('in an hour');
  });

  it('should return "a day ago" for a time 1 day in the past', () => {
    const result = formatRelativeTimeToNow('2023-05-14T12:00:00Z');
    expect(result).toBe('a day ago');
  });

  it('should return "in a day" for a time 1 day in the future', () => {
    const result = formatRelativeTimeToNow('2023-05-16T12:00:00Z');
    expect(result).toBe('in a day');
  });

  it('should return "a month ago" for a time 1 month in the past', () => {
    const result = formatRelativeTimeToNow('2023-04-15T12:00:00Z');
    expect(result).toBe('a month ago');
  });

  it('should return "in a month" for a time 1 month in the future', () => {
    const result = formatRelativeTimeToNow('2023-06-15T12:00:00Z');
    expect(result).toBe('in a month');
  });

  it('should return "a year ago" for a time 1 year in the past', () => {
    const result = formatRelativeTimeToNow('2022-05-15T12:00:00Z');
    expect(result).toBe('a year ago');
  });

  it('should return "in a year" for a time 1 year in the future', () => {
    const result = formatRelativeTimeToNow('2024-05-15T12:00:00Z');
    expect(result).toBe('in a year');
  });
});