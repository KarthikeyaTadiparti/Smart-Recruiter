import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Question } from "@/types/types";
import { vapiPrompt } from "@/lib/prompts";

// --- helper functions ---
function mapQuestionsToStrings(questions: Question[]): string[] {
    return questions.map((q) => q.question);
}

// const CONVERSATION = [
//     {
//         "role": "system",
//         "content": "You are an AI voice interviewer for the role of Full stack Developer.\nAsk the following questions one at a time in order:\n[\"In React, explain the difference between state and props. How do you manage component-specific data using the `useState` hook?\",\"Describe the role of `middleware` in an Express.js application. Can you give an example of a common use case for middleware, such as logging or authentication?\",\"When working with MongoDB, what are collections and documents? How do they conceptually relate to tables and rows in a relational database?\",\"How would you typically make an API call from your React frontend to your Express.js backend to fetch data? Briefly explain the steps involved, including what happens on both the client and server sides.\",\"You've deployed a MERN stack application, and users report that a specific feature is occasionally failing to save data to the database, though it works most of the time. What steps would you take to diagnose and debug this intermittent ..."
//     },
//     {
//         "role": "assistant",
//         "content": "Hi, Karthik. Yeah. How are you? Ready for your interview on full stack developer."
//     },
//     {
//         "role": "user",
//         "content": "Yeah. I'm ready."
//     },
//     {
//         "role": "assistant",
//         "content": "Great. Let's start with the first question. In React, explain the difference between state and props. How do you manage component specific data using the use of state hook?"
//     },
//     {
//         "role": "user",
//         "content": "Okay. So props are something the props are the data that are passed from parent component to children component, whereas states are"
//     },
//     {
//         "role": "assistant",
//         "content": "Okay. Not So props are for parent to child communication. And state is for managing data within a component. That's a good summary. Let's move on to the next question. Describe the role of middleware in an Express JS application. Can you give an example of a common use case for middleware such as logging or authentication?"
//     },
//     {
//         "role": "user",
//         "content": "Okay. So manually the function that sits in between the the, uh, request and the response object. And, um, for logging and authentication, middleware can be used to verify whether the user is whether the user's JWT token is verified. Correct 1 or not."
//     },
//     {
//         "role": "assistant",
//         "content": "Excellent explanation. Middleware truly is the backbone of Express."
//     }
// ]

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

        const onError = (error: any) => {
            console.error("Vapi error:", error);

            // Handle voice-provider ejects safely
            if (error?.error?.type === "ejected") {
                console.warn("Call ejected by voice provider");
                setIsSpeaking(false);
            }
        };

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
    }, [setIsSpeaking]);

    // --- remove it ---
    useEffect(() => {
        if (conversation.length > 0) {
            console.log("Conversation updated:", conversation);
        }
    }, [conversation]);


    const startVapi = (
        name: string | null,
        jobRole: string,
        questions: Question[]
    ) => {
        if (!vapiRef.current) return;

        const questionStrings = mapQuestionsToStrings(questions);

        const assistantOptions = {
            name: "AI Recruiter",

            firstMessage: `Hi ${name ?? "Candidate"
                }, how are you? Ready for your interview on ${jobRole}?`,

            transcriber: {
                provider: "deepgram" as const,
                model: "nova-2" as const,
                language: "en-US" as const,
                endpointing: 500,
            },

            voice: {
                provider: "openai" as const,
                voiceId: "alloy" as const,
            },

            model: {
                provider: "google" as const,
                model: "gemini-2.5-flash" as const,
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
        vapiRef.current?.stop();
        setIsSpeaking(false);
        console.log("Vapi stopped");
    };

    return { startVapi, stopVapi, conversation };
}
