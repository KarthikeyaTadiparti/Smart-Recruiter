import { Application, Candidate } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";
import { _getFeedback, _getFeedbacksByJobId, _saveConversation } from "../actions/feedback-actions";

interface FeedbackState {
    application: Application | null;
    candidate: Candidate | null;
    loading: {
        fetch: boolean;
        post: boolean;
    };
    error: any;
}

const initialState: FeedbackState = {
    application: null,
    candidate: null,
    loading: {
        fetch: false,
        post: false,
    },
    error: null,
};

const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(_getFeedback.pending, (state) => {
                state.loading.fetch = true;
            })
            .addCase(_getFeedback.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.application = action.payload.data.application;
                state.candidate = action.payload.data.candidate;
            })
            .addCase(_getFeedback.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error.message;
            })

            .addCase(_getFeedbacksByJobId.pending, (state) => {
                state.loading.fetch = true;
            })
            .addCase(_getFeedbacksByJobId.fulfilled, (state) => {
                state.loading.fetch = false;
            })
            .addCase(_getFeedbacksByJobId.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error.message;
            })

            .addCase(_saveConversation.pending, (state) => {
                state.loading.post = true;
            })
            .addCase(_saveConversation.fulfilled, (state, action) => {
                state.loading.post = false;
                // state.application = action.payload.data.application;
                // state.candidate = action.payload.data.candidate;
            })
            .addCase(_saveConversation.rejected, (state, action) => {
                state.loading.post = false;
                state.error = action.error.message;
            });
    }
});

export default feedbackSlice.reducer;
