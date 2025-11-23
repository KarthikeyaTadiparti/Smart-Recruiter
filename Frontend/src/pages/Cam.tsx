import React, { useRef, useState, useEffect, useCallback } from "react";

// CameraCapture.tsx
// - requests camera permission
// - shows live video preview
// - automatically captures a photo 3 seconds after permission is granted
// - shows a preview of the captured image and allows download
// - supports front/back camera selection

export default function Cam(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const autoCaptureTimeout = useRef<number | null>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (autoCaptureTimeout.current) {
        window.clearTimeout(autoCaptureTimeout.current);
        autoCaptureTimeout.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setCountdown(null);
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = canvasRef.current ?? document.createElement("canvas");
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPhoto(dataUrl);

    // stop camera after capture to free device
    stopCamera();
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    setError(null);
    setPhoto(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera API is not supported in this browser.");
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // playsInline + muted helps autoplay on mobiles
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      setIsCameraOn(true);

      // Countdown feedback for 3 seconds then capture
      let remaining = 3;
      setCountdown(remaining);
      const intervalId = window.setInterval(() => {
        remaining -= 1;
        setCountdown(remaining > 0 ? remaining : null);
        if (remaining <= 0) {
          window.clearInterval(intervalId);
        }
      }, 1000);

      // Ensure any previous timeout is cleared
      if (autoCaptureTimeout.current) {
        window.clearTimeout(autoCaptureTimeout.current);
        autoCaptureTimeout.current = null;
      }

      autoCaptureTimeout.current = window.setTimeout(() => {
        capturePhoto();
        autoCaptureTimeout.current = null;
      }, 3000);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setError(err?.message || String(err));
      setIsCameraOn(false);
      setCountdown(null);
    }
  }, [capturePhoto, facingMode]);

  const downloadPhoto = () => {
    if (!photo) return;
    const a = document.createElement("a");
    a.href = photo;
    a.download = `photo_${new Date().toISOString()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const toggleFacingMode = async () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));

    // If camera is on, restart it to apply the new facing mode
    if (isCameraOn) {
      stopCamera();
      // small delay to allow device to switch
      setTimeout(() => {
        startCamera();
      }, 250);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Camera Capture (Auto 3s)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-2xl overflow-hidden shadow p-2 flex flex-col items-center">
            <div className="w-full bg-black/5 rounded-lg overflow-hidden relative">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover bg-black"
                playsInline
                muted
                aria-label="Camera preview"
              />

              <canvas ref={canvasRef} className="hidden" />

              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-sm text-gray-500">Camera is off</div>
                </div>
              )}

              {countdown !== null && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-lg text-lg">
                  {countdown}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              {!isCameraOn ? (
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:brightness-105"
                >
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white shadow hover:brightness-105"
                >
                  Stop Camera
                </button>
              )}

              <button
                onClick={toggleFacingMode}
                className="px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                title="Toggle front / back camera"
              >
                Toggle Camera
              </button>

              <button
                onClick={capturePhoto}
                className="px-4 py-2 rounded-xl bg-green-600 text-white shadow hover:brightness-105"
                disabled={!isCameraOn}
              >
                Capture Now
              </button>
            </div>

            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow p-3 min-h-[220px] flex flex-col">
            <h3 className="font-medium mb-2">Captured Photo</h3>

            {photo ? (
              <>
                <img src={photo} alt="captured" className="rounded-lg w-full h-64 object-contain bg-black/5" />

                <div className="mt-3 flex gap-2">
                  <button onClick={downloadPhoto} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">
                    Download
                  </button>

                  <button
                    onClick={() => setPhoto(null)}
                    className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                  >
                    Retake
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-400">No photo captured yet — auto-captures 3s after permission.</span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500">
            <strong>Note:</strong> Allow camera access when the browser prompts. On some mobile devices you can switch cameras by toggling the camera if supported.
          </div>
        </div>
      </div>
    </div>
  );
}
