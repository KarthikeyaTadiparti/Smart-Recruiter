import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { StructuredQuestion } from "@/types/types";

// --- helper functions ---
function mapQuestionsToStrings(questions: StructuredQuestion[]): string[] {
    return questions.map((q) => q.question);
}

export function useVapi(setIsSpeaking: Dispatch<SetStateAction<boolean>>) {
    const vapiRef = useRef<Vapi | null>(null);
    const [conversation, setConversation] = useState<any[]>([]);

    useEffect(() => {
        if (!import.meta.env.VITE_VAPI_PUBLIC_KEY) {
            console.error("VAPI public key missing");
            return;
        }

        const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);
        vapiRef.current = vapi;

        const onCallStart = () => {
            console.log("Voice conversation started");
        };

        const onCallEnd = () => {
            console.log("Voice conversation ended");
            setIsSpeaking(false);
        };

        const onSpeechStart = () => {
            console.log("Assistant started speaking");
            setIsSpeaking(true);
        };

        const onSpeechEnd = () => {
            console.log("Assistant stopped speaking");
            setIsSpeaking(false);
        };

        const onMessage = (message: any) => {
            console.log(message);
            if (message?.type === "conversation-update") {
                setConversation(message.conversation);
            }
        };

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("message", onMessage);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("message", onMessage);
            vapi.stop();
        };
    }, [setIsSpeaking]);

    // --- remove it ---
    useEffect(() => {
        if (conversation.length > 0) {
            console.log("Conversation updated:", conversation);
        }
    }, [conversation]);

  //   useEffect(() => {
  //     if (callEnded && conversation.length > 0) {
  //         dispatch(saveConversation(conversation));
  //     }
  // }, [callEnded, conversation, dispatch]);

    const startVapi = (
        name: string | null,
        jobRole: string,
        questions: StructuredQuestion[]
    ) => {
        if (!vapiRef.current) return;

        const questionStrings = mapQuestionsToStrings(questions);

        const assistantOptions = {
            name: "AI Recruiter",

            firstMessage: `Hi ${
                name ?? "Candidate"
            }, how are you? Ready for your interview on ${jobRole}?`,

            transcriber: {
                provider: "deepgram" as const,
                model: "nova-2",
                language: "en-US",
            },

            voice: {
                provider: "playht" as const,
                voiceId: "jennifer",
            },

            model: {
                provider: "google" as const,
                model: "gemini-2.5-flash",
                messages: [
                    {
                        role: "system" as const,
                        content: `
You are an AI voice interviewer for the role of ${jobRole}.
Ask the following questions one at a time in order:
${JSON.stringify(questionStrings)}

Rules:
- Wait for the candidate to finish before continuing
- Give brief feedback after each answer
- Encourage retries when needed
- End with a short summary and encouragement
`.trim(),
                    },
                ],
            },
        };

        vapiRef.current.start(assistantOptions);
        console.log("Vapi started");
    };

    // ✅ Stop interview
    const stopVapi = () => {
        vapiRef.current?.stop();
        setIsSpeaking(false);
        console.log("Vapi stopped");
    };

    return { startVapi, stopVapi };
}
