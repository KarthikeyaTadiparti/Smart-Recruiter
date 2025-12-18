import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useInterviewTimer(
  started: boolean,
  ended: boolean,
  setEnded: Dispatch<SetStateAction<boolean>>,
  interviewDuration: number
) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (started && interviewDuration > 0) {
      setTimeLeft(interviewDuration * 60);
    }
  }, [started, interviewDuration]);

  useEffect(() => {
    if (!started || ended || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setEnded(true);

          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, ended, timeLeft, setEnded]);

  return { timeLeft };
}
