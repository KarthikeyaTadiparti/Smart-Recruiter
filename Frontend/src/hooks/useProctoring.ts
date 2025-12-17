import { ViolationType } from "@/types/types";
import { useEffect, useState } from "react";

export function useProctoring(started: boolean, ended: boolean) {
  const [violation, setViolation] = useState<ViolationType>(null);
  const [tabSwitches, setTabSwitches] = useState(0);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen();
    else if ((elem as any).msRequestFullscreen) (elem as any).msRequestFullscreen();
  };

  const logViolation = (type: ViolationType) => {
    if (violation) return;
    setTabSwitches(prev => prev + 1);
    setViolation(type);
    console.log("Violation:", type);
  };

  useEffect(() => {
    // Detect fullscreen change
    console.log("Procotoring is running")
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement;

      if (!fullscreenElement && started) {
        logViolation("FULLSCREEN_EXIT");
      }
    };

    // Detect tab switch (visibility change)
    const handleVisibilityChange = () => {
      if (document.hidden && started && !ended) {
        logViolation("TAB_SWITCH");
      }
    };

    // Attach listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [started, ended]);

  return { tabSwitches, violation, setViolation, enterFullscreen };
}
