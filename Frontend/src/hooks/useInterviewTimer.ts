import { useEffect, useState } from "react";

export function useInterviewTimer(
  started: boolean,
  ended: boolean,
  interviewDuration: number
) {
  const [timeLeft, setTimeLeft] = useState(interviewDuration * 60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (started) {
      setTimeLeft(interviewDuration * 60);
      setIsTimeUp(false);
    }
  }, [started, interviewDuration]);

  useEffect(() => {
    if (!started || ended || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, ended, timeLeft]);

  return { timeLeft, isTimeUp };
}
