import { useEffect, useState } from "react";

interface ClockProps {
  timezone: number; // seconds from UTC (from Weather API)
}

const Clock: React.FC<ClockProps> = ({ timezone }) => {
  const [dateTime, setDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const updateTime = () => {
      // Get current UTC time in milliseconds
      const now = new Date();
      // Convert to target timezone (timezone is in seconds, convert to milliseconds)
      const localOffset = now.getTimezoneOffset() * 60 * 1000; // in milliseconds
      const targetOffset = timezone * 1000; // convert seconds to milliseconds
      const targetTime = new Date(now.getTime() + localOffset + targetOffset);
      setDateTime(targetTime);
    };

    // Update immediately
    updateTime();
    
    // Then update every second
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]); // Add timezone to dependency array to update when timezone changes

  // Format the time (we've already adjusted for timezone, so we can use local time)
  const formattedTime = dateTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return <div className="text-blue-100 mt-2">{formattedTime}</div>;
};

export default Clock;