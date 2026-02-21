import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LogDialog from "@/components/LogDialog";
import StartScreen from "@/components/StartScreen";
import InterviewHeader from "@/components/InterviewHeader";
import InterviewContent from "@/components/InterviewContent";

import { useCamera } from "@/hooks/useCamera";
import { useInterviewTimer } from "@/hooks/useInterviewTimer";
import { useProctoring } from "@/hooks/useProctoring";
import { useVapi } from "@/hooks/useVapi";

import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { _getInterview } from "@/redux/actions/interview-actions";
import { _saveConversation } from "@/redux/actions/application-actions";
import { Interview as InterviewType } from "@/types/types";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// --- OPTIONS ---
const MAX_TAB_SWITCHES = 5;

export default function Interview() {
    const { id: jobId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const userData = useAppSelector((state) => state.auth.userData);
    const { fetch } = useAppSelector((state) => state.interview.loading);
    const { post } = useAppSelector((state) => state.application.loading);

    const [started, setStarted] = useState(false);
    const [ended, setEnded] = useState(false);
    const [interview, setInterview] = useState<InterviewType | null>(null);

    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const { videoRef, error } = useCamera(started, ended, setIsVideoOn);
    const { tabSwitches, violation, setViolation, enterFullscreen } = useProctoring(started, ended);
    const { timeLeft, isTimeUp } = useInterviewTimer(
        started,
        ended,
        interview?.interviewDuration ?? 0
    );

    const { startVapi, stopVapi, getConversation } = useVapi(setIsSpeaking);

    // --- fetches the interview details ---
    useEffect(() => {
        const fetchInterview = async () => {
            const { payload } = await dispatch(
                _getInterview({ id: Number(jobId), navigate })
            );

            const interviewData = payload?.data?.interview;
            setInterview(interviewData);
        };

        fetchInterview();
    }, [jobId, dispatch, navigate]);

    // --- stops the interview when time is up ---
    useEffect(() => {
        if (isTimeUp && !ended) {
            stopInterview();
        }
    }, [isTimeUp, ended]);

    // --- terminate the interview after 5 tab switches ---
    useEffect(() => {
        if (tabSwitches >= MAX_TAB_SWITCHES && !ended) {
            toast.error("Interview terminated: Maximum proctoring violations reached.");
            stopInterview();
        }
    }, [tabSwitches, ended]);

    // --- remove it ---
    useEffect(() => {
        if (interview) {
            console.log("Interview:", interview);
            // console.log("Conversation:", getConversation());
        }
    }, [interview]);

    const startInterview = () => {
        if (!userData?.name || !interview) return;

        setStarted(true);
        enterFullscreen();

        startVapi(userData?.name, interview?.jobRole, interview?.questions);
    };

    const stopInterview = async () => {
        if (ended) return;
        setEnded(true);
        stopVapi();

        try {
            const { payload } = await dispatch(
                _saveConversation({
                    data: { jobId, conversation: getConversation(), tabSwitches, questions: interview?.questions },
                    navigate,
                })
            );

            if (payload?.data?.status) {
                navigate(`/candidate/my-interviews/${payload.data.application.applicationId}`);
            } else {
                toast.error(payload?.data?.message || "Failed to save interview session");
            }
        } catch (error) {
            console.error("Error saving interview:", error);
            toast.error("An unexpected error occurred while saving the interview");
        }
    };

    if (fetch || post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white z-60">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (!interview) return null;

    if (!started)
        return (
            <StartScreen
                interview={interview}
                startInterview={startInterview}
            />
        );


    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 relative">
            <LogDialog
                violation={violation}
                tabSwitches={tabSwitches}
                maxTabSwitches={MAX_TAB_SWITCHES}
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
                maxTabSwitches={MAX_TAB_SWITCHES}
                stopInterview={stopInterview}
                setIsMicOn={setIsMicOn}
                isMicOn={isMicOn}
                setIsVideoOn={setIsVideoOn}
                isVideoOn={isVideoOn}
                isSpeaking={isSpeaking}
            />
        </div>
    );
}
