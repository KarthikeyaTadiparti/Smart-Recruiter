export interface Question {
    type: string;
    question: string;
}

export interface Application {
    candidateId: number;
    jobId: number;

    technicalScore: number;
    communicationScore: number;
    confidenceScore: number;
    overallScore: number;

    tabSwitches: number;

    conversation: any;
    questionAnswers: any;

    feedback: string;
}
