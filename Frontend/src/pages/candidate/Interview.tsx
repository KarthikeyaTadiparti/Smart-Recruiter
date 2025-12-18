import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LogDialog from "@/components/LogDialog";
import StartScreen from "@/components/StartScreen";
import EndScreen from "@/components/EndScreen";
import InterviewHeader from "@/components/InterviewHeader";
import InterviewContent from "@/components/InterviewContent";

import { useCamera } from "@/hooks/useCamera";
import { useInterviewTimer } from "@/hooks/useInterviewTimer";
import { useProctoring } from "@/hooks/useProctoring";
import { useVapi } from "@/hooks/useVapi";

import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { _getInterview } from "@/redux/actions/interview-actions";
import { interview as InterviewType } from "@/types/types";

export default function Interview() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const userData = useAppSelector((state) => state.auth.userData);
    const dispatch = useAppDispatch();

    const [started, setStarted] = useState(false);
    const [ended, setEnded] = useState(false);
    const [interview, setInterview] = useState<InterviewType | null>(null);

    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const { videoRef, error } = useCamera(started, ended, setIsVideoOn);
    const { tabSwitches, violation, setViolation, enterFullscreen } = useProctoring(started, ended);
    const { timeLeft } = useInterviewTimer(
        started,
        ended,
        setEnded,
        interview?.interviewDuration ?? 0
    );

    const { startVapi, stopVapi } = useVapi(setIsSpeaking);

    useEffect(() => {
        const fetchInterview = async () => {
            const { payload } = await dispatch(
                _getInterview({ id: Number(id), navigate })
            );

            const interviewData = payload?.data?.interview;
            setInterview(interviewData);
        };

        fetchInterview();
    }, [id, dispatch, navigate]);

    // --- remove it ---
    useEffect(() => {
        if (interview) {
            console.log("Interview:", interview);
        }
    }, [interview]);

    if (!interview) return null;

    const startInterview = () => {
        setStarted(true);
        enterFullscreen();
        startVapi(userData?.name, interview.jobRole, interview.questions);
    };

    const stopInterview = () => {
        setEnded(true);
        stopVapi();
    };

    // --- remove it ---
    const toggleSpeech = () => {
        if (!isSpeaking) {
            setIsSpeaking(true);
            setTimeout(() => setIsSpeaking(false), 3000);
        } else {
            setIsSpeaking(false);
        }
    };

    if (!started)
        return (
            <StartScreen
                interview={interview}
                startInterview={startInterview}
            />
        );

    if (ended)
        return <EndScreen interview={interview} tabSwitches={tabSwitches} />;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 relative">
            <LogDialog
                violation={violation}
                onClose={() => setViolation(null)}
                onReEnterFullscreen={enterFullscreen}
            />

            <InterviewHeader
                jobRole={interview.jobRole}
                stopInterview={stopInterview}
            />

            <InterviewContent
                interview={interview}
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
