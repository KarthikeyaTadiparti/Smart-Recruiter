import { ChevronLeft, ChevronRight, Clock, Mic, MicOff, ShieldAlert, Video, VideoOff } from 'lucide-react'
import { useState } from 'react'


function InterviewContent({
    interview,
    timeLeft,
    tabSwitches,
    maxTabSwitches,
    stopInterview,
    videoRef,
    cameraError,
    setIsMicOn,
    isMicOn,
    setIsVideoOn,
    isVideoOn,
    isSpeaking
}: any) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = interview.questions[currentQuestionIndex];

    // --- helper functions ---
    const handleNext = () => {
        if (currentQuestionIndex < interview.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            stopInterview();
            if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins: number = Math.floor(seconds / 60);
        const secs: number = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">

            {/* --- Left Column: Question Area (2 cols) --- */}
            <div className="lg:col-span-2 flex flex-col h-full gap-4">

                {/* Question Card */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col relative overflow-hidden">
                    {/* Timeline / Progress Bar at Top */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${((currentQuestionIndex + 1) / interview.noOfQuestions) * 100}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center mb-8 mt-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-primary bg-gray-100 px-2 py-1 rounded uppercase tracking-wide">
                                Question {currentQuestionIndex + 1} / {interview.noOfQuestions}
                            </span>

                            {/* Tab Switch / Violation Badge inside Question Card - ALWAYS VISIBLE */}
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border transition-colors ${tabSwitches > 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                <ShieldAlert size={12} />
                                <span>{tabSwitches} / {maxTabSwitches} Violation{tabSwitches !== 1 ? 's' : ''}</span>
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
                        className="flex items-center gap-2 px-6 py-2 bg-primary hover:opacity-90 text-white rounded-lg font-medium shadow-sm transition-all"
                    >
                        {currentQuestionIndex === interview.questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Proctoring Component */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-start gap-3">
                    <div className="mt-0.5 text-primary">
                        <ShieldAlert size={16} />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-primary mb-0.5">Proctoring Active</h3>
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
                        <div className={`w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 ${isSpeaking ? 'border-primary' : 'border-white shadow-sm'} transition-colors duration-300 relative z-10`}>
                            <div className="w-16 h-16 bg-primary rounded-full"></div>
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
    )
}

export default InterviewContent