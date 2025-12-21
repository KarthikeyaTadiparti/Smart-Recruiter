export interface Question {
    type: string;
    question: string;
}

export interface Application {
    candidateId: number;
    jobId: number;

    technicalScore: string;
    communicationScore: string;
    confidenceScore: string;
    overallScore: string;

    tabSwitches: number;

    conversation: any;
    questionAnswers: any;

    feedback: string;
}
