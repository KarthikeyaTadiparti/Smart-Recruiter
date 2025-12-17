import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useInterviewTimer(started: boolean, ended: boolean, setEnded: Dispatch<SetStateAction<boolean>>, interviewDuration: number) {
  const [timeLeft, setTimeLeft] = useState(interviewDuration * 60);

  useEffect(() => {
    console.log("Timer is running")

    if (!started || ended) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setEnded(true);
          // Auto exit fullscreen on end
          if (document.exitFullscreen)
            document.exitFullscreen().catch(() => { });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, ended]);

  return { timeLeft };
}
