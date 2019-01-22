import {useState, useEffect} from 'react';

/**
 * Returns the date accurate to the second. This will sync up with the seconds
 * when mounted and then increment every subsequent second. It may be wise to
 * memoize any functional components contained within a component that uses this
 * hook as it may cause them to re-mount every second when the date increments.
 */
export default function useExactDate() {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    const mountDate = new Date();
    // Set initial date in order to avoid skipping a second.
    setDate(mountDate);
    // Set timeout for 1s - current ms to get remaining ms until next second.
    setTimeout(() => {
      // Once timeout completes, set date to change to new second.
      setDate(new Date());
      // Set interval to increment every subsequent second.
      intervalId = setInterval(() => setDate(new Date()), 1000);
    }, 1000 - mountDate.getMilliseconds());
    // Clear interval on unmount.
    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, []);

  return date;
}
