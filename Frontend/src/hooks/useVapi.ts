import { useRef } from "react";
import Vapi from "@vapi-ai/web";

export function useVapi() {
  const vapiRef = useRef<Vapi | null>(null);

  const startVapi = (name: string | null, jobRole: string, questions: { type: string; question: string; }[]) => {
    if (!import.meta.env.VITE_VAPI_PUBLIC_KEY) {
      console.error("VAPI public key missing");
      return;
    }

    if (!vapiRef.current) {
      vapiRef.current = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);
    }

    const assistantOptions = {
      name: "AI Recruiter",

      firstMessage: `Hi ${name ?? "Candidate"}, how are you? Ready for your interview on ${jobRole}?`,

      transcriber: {
        provider: "deepgram" as const,
        model: "nova-2",
      },

      language: "en-US",

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
You are an AI voice assistant conducting interviews.
Ask these questions in order:
${JSON.stringify(questions)}
            `,
          },
        ],
      },
    };

    vapiRef.current.start(assistantOptions);
    console.log("vapi started");
  };

  const stopVapi = () => {
    vapiRef.current?.stop();
    console.log("vapi stopped");
  };

  return { startVapi, stopVapi };
}
