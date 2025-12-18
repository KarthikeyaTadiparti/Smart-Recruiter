import { createSlice } from "@reduxjs/toolkit";
import {
    _generateQuestions,
    _getAllJobs,
    _getJob,
} from "@/redux/actions/job-actions";
import { parseQuestions } from "@/lib/utils";

export interface JobQuestion {
    type?: string;
    question: string;
}

interface JobInitialStateType {
    loading: {
        fetchAll: boolean;
        fetch: boolean;
    };
    error: string | null;
    jobQuestions: JobQuestion[];
}

// --- initial state ---
const initialState: JobInitialStateType = {
    loading: {
        fetchAll: false,
        fetch: false,
    },
    error: null,
    jobQuestions: [],
};

// --- slice ---
const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {},
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

                state.jobQuestions = parseQuestions(rawQuestions);
            })
            .addCase(_generateQuestions.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error =
                    action.error?.message ?? "Failed to generate questions";
            })

            //fetchAll
            .addCase(_getAllJobs.pending, (state) => {
                state.loading.fetchAll = true;
            })
            .addCase(_getAllJobs.fulfilled, (state) => {
                state.loading.fetchAll = false;
            })
            .addCase(_getAllJobs.rejected, (state) => {
                state.loading.fetchAll = false;
            })

            //fetch
            .addCase(_getJob.pending, (state) => {
                state.loading.fetch = true;
            })
            .addCase(_getJob.fulfilled, (state) => {
                state.loading.fetch = false;
            })
            .addCase(_getJob.rejected, (state) => {
                state.loading.fetch = false;
            });
    },
});

export default jobSlice.reducer;
