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

export type Job = {
    jobId: number;
    jobRole: string;
    description: string;
    techStack: string;
    experience: number;
    location: string;
    closedAt: string;
    companyId: number;
    companyName: string;
    interviewId: number;
    interviewType: string;
    interviewDuration: number;
    noOfQuestions: number;
};

export type IndividualJob = {
    jobId: number;
    jobRole: string;
    description: string;
    techStack: string;
    experience: number;
    location: string;
    closedAt: string;
    interviewType: string;
    interviewDuration: number;
    noOfQuestions: number;
    comapnyName: string;
    companyDescription: string;
    website: string;
    recruiterName: string;
    email: string;
};

export type Question = {
    type: string;
    question: string;
};
