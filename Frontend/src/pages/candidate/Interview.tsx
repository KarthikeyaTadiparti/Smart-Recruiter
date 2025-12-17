import { useState } from 'react';
import LogDialog from '@/components/LogDialog';
import StartScreen from '@/components/StartScreen';
import EndScreen from '@/components/EndScreen';
import InterviewHeader from '@/components/InterviewHeader';
import InterviewContent from '@/components/InterviewContent';
import { useCamera } from '@/hooks/useCamera';
import { useInterviewTimer } from '@/hooks/useInterviewTimer';
import { useProctoring } from '@/hooks/useProctoring';
import { useVapi } from '@/hooks/useVapi';
import { useAppSelector } from '@/hooks/use-redux';

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
    // Global States
    const userData = useAppSelector((state) => state.auth.userData)

    // Local States
    const [started, setStarted] = useState(false);
    const [ended, setEnded] = useState(false);

    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const { videoRef, error } = useCamera(started, ended, setIsVideoOn);
    const { tabSwitches, violation, setViolation, enterFullscreen } = useProctoring(started, ended);
    const { timeLeft } = useInterviewTimer(started, ended, setEnded, API_RESPONSE.interview.interviewDuration);

    const { startVapi, stopVapi } = useVapi();

    // --- helper functions ---
    const startInterview = () => {
        setStarted(true);
        enterFullscreen();
        startVapi(userData.name, API_RESPONSE.interview.jobRole, API_RESPONSE.interview.questions);
    };

    const stopInterview = () => {
        setEnded(true);
        stopVapi();
    }


    const toggleSpeech = () => {
        if (!isSpeaking) {
            setIsSpeaking(true);
            setTimeout(() => setIsSpeaking(false), 3000);
        } else {
            setIsSpeaking(false);
        }
    };

    //--- RENDER: Start Screen ---
    if (!started)
        return <StartScreen interview={API_RESPONSE.interview} startInterview={startInterview} />

    // --- RENDER: End Screen ---
    if (ended)
        return <EndScreen interview={API_RESPONSE.interview} tabSwitches={tabSwitches} />

    // --- RENDER: Interview Dashboard ---
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">

            <LogDialog
                violation={violation}
                onClose={() => setViolation(null)}
                onReEnterFullscreen={enterFullscreen}
            />
            {/* --- Header --- */}
            <InterviewHeader jobRole={API_RESPONSE.interview.jobRole} stopInterview={stopInterview} />

            {/* --- Main Content --- */}
            <InterviewContent
                interview={API_RESPONSE.interview}
                videoRef={videoRef}
                cameraError={error}
                timeLeft={timeLeft}
                tabSwitches={tabSwitches}
                setEnded={setEnded}
                setIsMicOn={setIsMicOn}
                isMicOn={isMicOn}
                setIsVideoOn={setIsVideoOn}
                isVideoOn={isVideoOn}
                isSpeaking={isSpeaking}
            />
        </div>
    );
}