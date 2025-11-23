import React, { useEffect, useState } from "react";

const Test: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [violationCount, setViolationCount] = useState(0);

  // Enter fullscreen (must be triggered by user gesture)
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen();
    else if ((elem as any).msRequestFullscreen) (elem as any).msRequestFullscreen();
  };

  // Detect fullscreen change
  const handleFullscreenChange = () => {
    const fullscreenElement =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement;

    if (!fullscreenElement && started) {
      logViolation("Exited Fullscreen");
    }
  };

  // Detect tab switch (visibility change)
  const handleVisibilityChange = () => {
    if (document.hidden && started) {
      logViolation("Tab Switch");
    }
  };

  // Log violation
  const logViolation = (type: string) => {
    setViolationCount((prev) => prev + 1);
    setShowWarning(true);
    console.log(`Violation: ${type}`);

    // TODO: Send violation to backend, e.g.
    // axios.post("/api/logViolation", { type, timestamp: Date.now() });
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [started]);

  const startInterview = () => {
    setStarted(true);
    enterFullscreen();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {!started ? (
        <>
          <h1 className="text-3xl font-bold mb-4">AI Interview</h1>
          <p className="text-lg mb-4">
            Click below to start and enter full-screen mode.
          </p>
          <button
            onClick={startInterview}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-lg"
          >
            Start Interview
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">AI Interview in Progress</h1>
          <p className="text-lg">Please stay in fullscreen during the interview.</p>

          {showWarning && (
            <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg animate-pulse">
              ⚠️ Violation detected! Click below to re-enter fullscreen.
            </div>
          )}

          {showWarning && (
            <button
              onClick={enterFullscreen}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg"
            >
              Re-enter Fullscreen
            </button>
          )}

          <p className="mt-4 text-gray-300">
            Total violations: {violationCount}
          </p>
        </>
      )}
    </div>
  );
};

export default Test;
