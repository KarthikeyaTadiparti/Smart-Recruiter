export type ViolationType = "TAB_SWITCH" | "FULLSCREEN_EXIT" | null;

export interface interview {
    jobId: number;
    jobRole: string;
    interviewType: string;
    interviewDuration: number;
    questions: {
        type: string;
        question: string;
    }[];
    noOfQuestions: number;
}


export type StructuredQuestion = {
    type: string;
    question: string;
  };
  