import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export function useCamera(started: boolean, ended: boolean, setIsVideoOn: Dispatch<SetStateAction<boolean>>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Camera is running")

    const startCamera = async (): Promise<void> => {
      if (!started || ended) return;

      try {
        const stream: MediaStream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setError(null);
      } catch (err: unknown) {
        console.error("Error accessing media devices:", err);
        setError("Camera/Mic access denied or unavailable.");
        setIsVideoOn(false);
      }
    };

    startCamera();

    return (): void => {
      streamRef.current?.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    };
  }, [started, ended]);

  return { videoRef, error };
}
