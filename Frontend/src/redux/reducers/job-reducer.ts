import { createSlice } from "@reduxjs/toolkit";
import {
    _createJob,
    _generateQuestions,
    _getAllJobs,
    _getJob,
    _getJobsByRecruiterId,
} from "@/redux/actions/job-actions";


export interface JobQuestion {
    type?: string;
    question: string;
}

interface JobInitialStateType {
    loading: {
        fetchAll: boolean;
        fetch: boolean;
        generateQuestions: boolean;
        storeQuestions: boolean;
        fetchRecruiterJobs: boolean;
    };
    error: string | null;
    jobQuestions: JobQuestion[]
}

// --- initial state ---
const initialState: JobInitialStateType = {
    loading: {
        fetchAll: false,
        fetch: false,
        generateQuestions: false,
        storeQuestions: false,
        fetchRecruiterJobs: false,
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
            //generate Questions
            .addCase(_generateQuestions.pending, (state) => {
                state.loading.generateQuestions = true;
                state.error = null;
            })
            .addCase(_generateQuestions.fulfilled, (state, action) => {
                state.loading.generateQuestions = false;
                state.error = null;
                state.jobQuestions = action.payload.data.questions;
            })
            .addCase(_generateQuestions.rejected, (state, action) => {
                state.loading.generateQuestions = false;
                state.error =
                    action.error?.message ?? "Failed to generate questions";
            })

            .addCase(_createJob.pending, (state) => {
                state.loading.storeQuestions = true;
                state.error = null;
            })
            .addCase(_createJob.fulfilled, (state, action) => {
                state.loading.storeQuestions = false;
                state.error = null;
                state.jobQuestions = action.payload.data.questions;
            })
            .addCase(_createJob.rejected, (state, action) => {
                state.loading.storeQuestions = false;
                state.error =
                    action.error?.message ?? "Failed to store questions";
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
            })

            //fetchRecruiterJobs
            .addCase(_getJobsByRecruiterId.pending, (state) => {
                state.loading.fetchRecruiterJobs = true;
            })
            .addCase(_getJobsByRecruiterId.fulfilled, (state) => {
                state.loading.fetchRecruiterJobs = false;
            })
            .addCase(_getJobsByRecruiterId.rejected, (state) => {
                state.loading.fetchRecruiterJobs = false;
            });

    },
});

export default jobSlice.reducer;
