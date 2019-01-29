import {useEffect, useState} from 'react';

/**
 * Returns the date accurate to the second. This will sync up with the seconds
 * when mounted and then increment every subsequent second. It may be wise to
 * memoize any functional components contained within a component that uses this
 * hook as it may cause them to re-mount every second when the date increments.
 */
export default function useExactDate() {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    // Given the current time's milliseconds, will wait until next second, then
    // will get time, set date, and start another timeout for the next second.
    const updateDate = (currentMilliseconds: number) =>
      setTimeout(() => {
        const now = new Date();
        setDate(now);
        timeoutId = updateDate(now.getMilliseconds()); // Call self for next ms.
      }, 1000 - currentMilliseconds);

    // Initial set date and timeout.
    const mountNow = new Date();
    setDate(mountNow);
    timeoutId = updateDate(mountNow.getMilliseconds());

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return date;
}
