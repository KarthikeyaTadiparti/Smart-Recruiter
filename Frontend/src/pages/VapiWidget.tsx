import React from "react";
import Vapi from "@vapi-ai/web";

function VapiWidget() {
  const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

  const interviewInfo = {
    userName: "Karthikeya",
    jobPosition: "React Developer",
    questionList: [
      "What are React hooks and why are they used?",
      "Explain the difference between useEffect and useLayoutEffect.",
      "How does React reconcile changes in the virtual DOM?",
      "What is prop drilling and how do you avoid it?",
      "Explain how useMemo and useCallback improve performance.",
      "What is the purpose of React keys in lists?",
      "Describe how state is lifted up in React."
    ],
  };

  const assistantOptions = {
    name: "AI Recruiter",

    firstMessage: `Hi ${interviewInfo.userName}, how are you? Ready for your interview on ${interviewInfo.jobPosition}?`,

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
      provider: "openai" as const,
      model: "gpt-4o",
      messages: [
        {
          role: "system" as const,
          content: `
You are an AI voice assistant conducting interviews.
Ask these questions: ${JSON.stringify(interviewInfo.questionList)}
          `,
        },
      ],
    },
  };

  const startInterview = () => {
    vapi.start(assistantOptions);
  };

  const stopInterview = () => {
    vapi.stop(); // ⭐ this stops the current session
  };

  return (
    <>
      <div className="text-center text-xl font-bold mb-4">Vapi Testing</div>

      <div className="flex justify-center gap-4">
        {/* Start Button */}
        <button
          onClick={startInterview}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Start Interview
        </button>

        {/* Stop Button */}
        <button
          onClick={stopInterview}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Stop Interview
        </button>
      </div>
    </>
  );
}

export default VapiWidget;
