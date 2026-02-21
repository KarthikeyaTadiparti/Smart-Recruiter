import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Question } from "@/types/types";
import { vapiPrompt } from "@/lib/prompts";

// --- helper functions ---
function mapQuestionsToStrings(questions: Question[]): string[] {
    return questions.map((q) => q.question);
}

export function useVapi(
    setIsSpeaking: Dispatch<SetStateAction<boolean>>,
    onCriticalError?: () => void
) {
    const vapiRef = useRef<Vapi | null>(null);
    const conversationRef = useRef<any[]>([]);

    // UI speaking state (React)
    const setIsSpeakingRef = useRef(setIsSpeaking);
    setIsSpeakingRef.current = setIsSpeaking;

    const onCriticalErrorRef = useRef(onCriticalError);
    onCriticalErrorRef.current = onCriticalError;

    // HARD LOCK: prevents overlapping assistant speech
    const isAssistantSpeakingRef = useRef(false);

    useEffect(() => {
        if (!import.meta.env.VITE_VAPI_PUBLIC_KEY) {
            console.error("VAPI public key missing");
            return;
        }

        const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);
        vapiRef.current = vapi;

        // ---------------- EVENTS ----------------

        const onCallStart = () => {
            console.log("Voice conversation started");
        };

        const onCallEnd = () => {
            console.log("Voice conversation ended");
            isAssistantSpeakingRef.current = false;
            setIsSpeakingRef.current(false);
        };

        const onSpeechStart = () => {
            console.log("Assistant started speaking");
            isAssistantSpeakingRef.current = true;
            setIsSpeakingRef.current(true);
        };

        const onSpeechEnd = () => {
            console.log("Assistant stopped speaking");
            isAssistantSpeakingRef.current = false;
            setIsSpeakingRef.current(false);
        };

        const onMessage = (message: any) => {
            // Ignore updates while assistant is speaking
            if (isAssistantSpeakingRef.current) return;

            if (message?.type === "conversation-update") {
                conversationRef.current = message.conversation;
            }
        };

        const onError = (error: any) => {
            console.error("Vapi error:", error);

            const isEjected = error?.error?.type === "ejected";

            if (isEjected) {
                console.warn("Call terminated by voice provider:", error?.errorMsg || error?.error?.msg);
                isAssistantSpeakingRef.current = false;
                setIsSpeakingRef.current(false);

                if (onCriticalErrorRef.current) {
                    onCriticalErrorRef.current();
                }
            }
        };

        // ---------------- REGISTER ----------------

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("message", onMessage);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("message", onMessage);
            vapi.off("error", onError);
            vapi.stop();
        };
    }, []);

    // ---------------- PUBLIC API ----------------

    const startVapi = (
        name: string | null,
        jobRole: string,
        questions: Question[]
    ) => {
        if (!vapiRef.current) return;

        // Prevent duplicate starts
        if (isAssistantSpeakingRef.current) return;

        const questionStrings = mapQuestionsToStrings(questions);

        const assistantOptions = {
            name: "AI Recruiter",

            firstMessage: `Hi ${name ?? "Candidate"}, how are you? Ready for your interview on ${jobRole}?`,

            transcriber: {
                provider: "deepgram" as const,
                model: "nova-2" as const,
                language: "en-US" as const,
                endpointing: 500, // FIX: avoid multiple turn triggers
            },

            voice: {
                provider: "openai" as const,
                voiceId: "alloy" as const,
            },

            model: {
                provider: "openai" as const,
                model: "gpt-4o-mini" as const,
                messages: [
                    {
                        role: "system" as const,
                        content: vapiPrompt(jobRole, questionStrings),
                    },
                ],
            },
        };

        vapiRef.current.start(assistantOptions);
        console.log("Vapi started");
    };

    const stopVapi = () => {
        if (vapiRef.current) {
            vapiRef.current.stop();
        }
        isAssistantSpeakingRef.current = false;
        setIsSpeaking(false);
        console.log("Vapi stopped");
    };

    const getConversation = () => conversationRef.current;

    return { startVapi, stopVapi, getConversation };
}
