import { useState, useEffect, useRef } from 'react';
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Clock,
    ChevronRight,
    ChevronLeft,
    ShieldAlert,
    StopCircle,
    Settings,
    Maximize
} from 'lucide-react';
import { toast } from 'sonner';

// Mock Data from the prompt
const API_RESPONSE = {
    status: true,
    message: "Your interview has started",
    interview: {
        jobId: 16,
        jobRole: "Full Stack Developer",
        interviewType: "technical",
        interviewDuration: 5, // in minutes
        questions: [
            {
                type: "technical",
                question: "In React, explain the difference between state and props. How do you manage component-specific data using the `useState` hook?"
            },
            {
                type: "technical",
                question: "Describe the role of `middleware` in an Express.js application. Can you give an example of a common use case for middleware, such as logging or authentication?"
            },
            {
                type: "technical",
                question: "When working with MongoDB, what are collections and documents? How do they conceptually relate to tables and rows in a relational database?"
            },
            {
                type: "technical",
                question: "How would you typically make an API call from your React frontend to your Express.js backend to fetch data? Briefly explain the steps involved, including what happens on both the client and server sides."
            },
            {
                type: "scenario-based",
                question: "You've deployed a MERN stack application, and users report that a specific feature is occasionally failing to save data to the database, though it works most of the time. What steps would you take to diagnose and debug this intermittent issue, starting from the frontend to the backend and database?"
            }
        ],
        noOfQuestions: 5
    }
};

export default function Interview() {
    // State Management
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [tabSwitches, setTabSwitches] = useState(0); // Also acts as total violation count
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(API_RESPONSE.interview.interviewDuration * 60);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [interviewEnded, setInterviewEnded] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // Refs
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // --- 1. Fullscreen & Proctoring Logic ---

    // Enter fullscreen (must be triggered by user gesture)
    const enterFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen();
        else if ((elem as any).msRequestFullscreen) (elem as any).msRequestFullscreen();
    };

    // Log violation
    const logViolation = (type: any) => {
        setTabSwitches((prev) => prev + 1);
        setShowWarning(true);
        console.log(`Violation: ${type}`);
        // Optional: Auto-hide warning after some time if desired, 
        // but for strict proctoring, usually we want the user to acknowledge or fix it.
    };

    useEffect(() => {
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
            if (document.hidden && started && !interviewEnded) {
                logViolation("Tab Switch");
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
    }, [started, interviewEnded]);


    // --- 2. Camera Access Logic (Starts only when interview starts) ---
    useEffect(() => {
        const startCamera = async (): Promise<void> => {
            if (!started || interviewEnded) return;

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

                setCameraError(null);
            } catch (err: unknown) {
                console.error("Error accessing media devices:", err);
                setCameraError("Camera/Mic access denied or unavailable.");
                setIsVideoOn(false);
            }
        };

        startCamera();

        return (): void => {
            streamRef.current?.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop();
            });
        };
    }, [started, interviewEnded]);


    // --- 3. Timer Logic (Runs only when started) ---
    useEffect(() => {
        if (!started || interviewEnded) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setInterviewEnded(true);
                    // Auto exit fullscreen on end
                    if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [started, interviewEnded]);

    // --- 4. Proctoring Warning Logic ---
    useEffect(() => {
        if (!showWarning) return;

        showProctoringWarning();
        setShowWarning(false);
    }, [showWarning]);



    // Helpers
    const formatTime = (seconds: number): string => {
        const mins: number = Math.floor(seconds / 60);
        const secs: number = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const startInterview = () => {
        setStarted(true);
        enterFullscreen();
    };

    const currentQuestion = API_RESPONSE.interview.questions[currentQuestionIndex];

    const handleNext = () => {
        if (currentQuestionIndex < API_RESPONSE.interview.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsSpeaking(false);
        } else {
            setInterviewEnded(true);
            if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setIsSpeaking(false);
        }
    };

    const toggleSpeech = () => {
        if (!isSpeaking) {
            setIsSpeaking(true);
            setTimeout(() => setIsSpeaking(false), 3000);
        } else {
            setIsSpeaking(false);
        }
    };

    // --- RENDER: Start Screen ---
    if (!started) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
                <div className="max-w-lg w-full bg-white rounded-xl p-8 border border-gray-200 text-center shadow-lg">
                    <div className="w-16 h-16 bg-[oklch(0.21_0.006_285.885)] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-gray-900">Technical Assessment</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        You are about to start a <strong>{API_RESPONSE.interview.interviewDuration} minute</strong> technical interview for the <strong>{API_RESPONSE.interview.jobRole}</strong> role.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Proctoring Rules</h3>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-start gap-3">
                                <Maximize size={18} className="text-[oklch(0.21_0.006_285.885)] mt-0.5" />
                                <span><strong>Fullscreen Mode:</strong> The interview must be taken in fullscreen. Exiting will be recorded as a violation.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ShieldAlert size={18} className="text-[oklch(0.21_0.006_285.885)] mt-0.5" />
                                <span><strong>Tab Switching:</strong> Moving to another tab or window is monitored and will be flagged.</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={startInterview}
                        className="w-full bg-[oklch(0.21_0.006_285.885)] hover:opacity-90 text-white py-3 rounded-lg text-lg font-medium shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        Start Interview
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER: End Screen ---
    if (interviewEnded) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
                <div className="max-w-md w-full bg-white rounded-xl p-8 border border-gray-200 text-center shadow-lg">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <StopCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Interview Completed</h2>
                    <p className="text-gray-500 mb-6">Thank you for attending the technical round.</p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3 border border-gray-100">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Duration:</span>
                            <span className="font-mono font-medium">{API_RESPONSE.interview.interviewDuration} mins</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Questions Answered:</span>
                            <span className="font-mono font-medium">{API_RESPONSE.interview.questions.length}/{API_RESPONSE.interview.noOfQuestions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Violations Detected:</span>
                            <span className={`font-bold px-2 py-0.5 rounded text-sm ${tabSwitches > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {tabSwitches}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-[oklch(0.21_0.006_285.885)] hover:opacity-90 text-white py-2.5 rounded-lg transition-colors font-medium shadow-sm"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }


    const showProctoringWarning = () => {
  toast.custom((t) => (
    <div className="w-[320px] rounded-lg border bg-popover p-4 shadow-lg">
      <div className="flex gap-3">
        <ShieldAlert className="text-destructive mt-0.5" size={18} />

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-destructive">
            Proctoring Violation
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Fullscreen exit or tab switch detected. This event has been logged.
          </p>

          {/* Button aligned to right */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                enterFullscreen()
                toast.dismiss(t)
              }}
              className="
                inline-flex items-center justify-center
                rounded-md
                border border-gray-300
                bg-gray-100
                px-3 py-1.5
                text-xs font-medium
                text-gray-700
                shadow-sm
                hover:bg-gray-200
                active:bg-gray-300
                focus:outline-none
                focus:ring-2 focus:ring-gray-400
                transition-colors
              "
            >
              Re-enter Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>
  ))
}


    // --- RENDER: Interview Dashboard ---
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">

            {/* --- Header --- */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[oklch(0.21_0.006_285.885)] rounded flex items-center justify-center text-white font-bold text-lg">
                        AI
                    </div>
                    <div className="h-8 w-px bg-gray-200 mx-1"></div>
                    <div>
                        <h1 className="font-semibold text-sm text-gray-900">{API_RESPONSE.interview.jobRole}</h1>
                        <div className="text-xs text-gray-500">Technical Assessment</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => setInterviewEnded(true)}
                        className="ml-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                    >
                        End Session
                    </button>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">

                {/* --- Left Column: Question Area (2 cols) --- */}
                <div className="lg:col-span-2 flex flex-col h-full gap-4">

                    {/* Question Card */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col relative overflow-hidden">
                        {/* Timeline / Progress Bar at Top */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                            <div
                                className="h-full bg-[oklch(0.21_0.006_285.885)] transition-all duration-500 ease-out"
                                style={{ width: `${((currentQuestionIndex + 1) / API_RESPONSE.interview.noOfQuestions) * 100}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-center mb-8 mt-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-[oklch(0.21_0.006_285.885)] bg-gray-100 px-2 py-1 rounded uppercase tracking-wide">
                                    Question {currentQuestionIndex + 1} / {API_RESPONSE.interview.noOfQuestions}
                                </span>

                                {/* Tab Switch / Violation Badge inside Question Card - ALWAYS VISIBLE */}
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border transition-colors ${tabSwitches > 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                    <ShieldAlert size={12} />
                                    <span>{tabSwitches} Violation{tabSwitches !== 1 ? 's' : ''}</span>
                                </div>
                            </div>

                            {/* Timer */}
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded bg-gray-100 border border-gray-200 ${timeLeft < 60 ? 'text-red-600 bg-red-50 border-red-100' : 'text-gray-700'}`}>
                                <Clock size={16} />
                                <span className="font-mono font-semibold text-sm">{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 flex items-center justify-center">
                            <h2 className="text-2xl text-gray-800 font-medium leading-relaxed text-center">
                                {currentQuestion.question}
                            </h2>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <button
                            onClick={handlePrev}
                            disabled={currentQuestionIndex === 0}
                            className="flex items-center gap-1 px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            <ChevronLeft size={18} />
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-2 bg-[oklch(0.21_0.006_285.885)] hover:opacity-90 text-white rounded-lg font-medium shadow-sm transition-all"
                        >
                            {currentQuestionIndex === API_RESPONSE.interview.questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Proctoring Component */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-start gap-3">
                        <div className="mt-0.5 text-[oklch(0.21_0.006_285.885)]">
                            <ShieldAlert size={16} />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-[oklch(0.21_0.006_285.885)] mb-0.5">Proctoring Active</h3>
                            <p className="text-[10px] text-gray-600 leading-relaxed">
                                Your browser activity and webcam are being monitored. Switching tabs or exiting fullscreen is recorded.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Video Sidebar (1 col) --- */}
                <div className="flex flex-col gap-4">

                    {/* AI Avatar */}
                    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden aspect-video flex items-center justify-center">
                        <div className="absolute top-3 left-3 bg-gray-900/10 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                            AI Interviewer
                        </div>

                        {/* Simple Pulse Animation */}
                        <div className="relative flex items-center justify-center">
                            {isSpeaking && <div className="absolute w-24 h-24 bg-gray-200 rounded-full animate-ping opacity-75"></div>}
                            <div className={`w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 ${isSpeaking ? 'border-[oklch(0.21_0.006_285.885)]' : 'border-white shadow-sm'} transition-colors duration-300 relative z-10`}>
                                <div className="w-16 h-16 bg-[oklch(0.21_0.006_285.885)] rounded-full"></div>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-3">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-1 h-1 rounded-full bg-gray-400 ${isSpeaking ? 'animate-bounce' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* User Camera */}
                    <div className="relative flex-1 bg-gray-900 rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[200px] group">
                        <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                            You
                        </div>

                        {/* Video Controls Overlay (Visible on Hover) */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 gap-4">
                            <button
                                onClick={() => setIsMicOn(!isMicOn)}
                                className={`p-3 rounded-full ${isMicOn ? 'bg-white text-gray-900' : 'bg-red-500 text-white'} transition-colors shadow-lg`}
                            >
                                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                            </button>
                            <button
                                onClick={() => setIsVideoOn(!isVideoOn)}
                                className={`p-3 rounded-full ${isVideoOn ? 'bg-white text-gray-900' : 'bg-red-500 text-white'} transition-colors shadow-lg`}
                            >
                                {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                            </button>
                            <button className="p-3 rounded-full bg-gray-800/80 text-white hover:bg-gray-700 transition-colors shadow-lg">
                                <Settings size={20} />
                            </button>
                        </div>

                        {cameraError ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
                                <VideoOff size={32} className="mb-2 opacity-50" />
                                <span className="text-xs">Camera Unavailable</span>
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className={`w-full h-full object-cover transform scale-x-[-1] bg-gray-800 ${isVideoOn ? 'opacity-100' : 'opacity-0'}`}
                            />
                        )}

                        {/* Fallback Avatar */}
                        {!isVideoOn && !cameraError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                    <span className="text-2xl font-bold">You</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}