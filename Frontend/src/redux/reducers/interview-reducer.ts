import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { _generateQuestions } from "@/redux/actions/interview-actions"
import { parseQuestions } from "@/lib/utils";

export interface InterviewQuestion {
    type?: string;
    question: string;
}

interface InterviewInitialStateType {
    loading: {
        fetch: boolean;
    };
    error: string | null;
    interviewQuestions: InterviewQuestion[];
}



// --- initial state ---
const initialState: InterviewInitialStateType = {
    loading: {
        fetch: false,
    },
    error: null,
    interviewQuestions: [],
};

// --- slice ---
const interviewSlice = createSlice({
    name: "interviews",
    initialState,
    reducers: {
        // manual setter if needed elsewhere
        setInterviewQuestions(state, action: PayloadAction<InterviewQuestion[]>) {
            state.interviewQuestions = action.payload;
        },
        clearQuestions(state) {
            state.interviewQuestions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(_generateQuestions.pending, (state) => {
                state.loading.fetch = true;
                state.error = null;
            })
            .addCase(_generateQuestions.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.error = null;

                const payload = action.payload;

                // Try to extract the raw questions from common shapes:
                // - axios-like: payload.data.questions OR payload.data
                // - direct: payload.questions
                // - sometimes payload itself is string/object
                let rawQuestions: any = undefined;
                if (!payload) {
                    rawQuestions = undefined;
                } else if (Array.isArray(payload)) {
                    rawQuestions = payload;
                } else if (payload.data) {
                    rawQuestions = payload.data.questions ?? payload.data;
                } else if (payload.questions) {
                    rawQuestions = payload.questions;
                } else {
                    rawQuestions = payload;
                }

                state.interviewQuestions = parseQuestions(rawQuestions);
            })
            .addCase(_generateQuestions.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error?.message ?? "Failed to generate questions";
            });
    },
});


export const { setInterviewQuestions } = interviewSlice.actions;
export default interviewSlice.reducer