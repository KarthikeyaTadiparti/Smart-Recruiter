import { Application, Candidate } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";
import { _getFeedback, _saveConversation } from "../actions/feedback-actions";



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
    reducers: {
        // setFeedback: (state, action) => {
        //     state.application = action.payload.application;
        //     state.candidate = action.payload.candidate;
        // },
        // setLoading: (state, action) => {
        //     state.loading.fetch = action.payload;
        // },
        // setError: (state, action) => {
        //     state.error = action.payload;
        // },
    },
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

// export const { setFeedback, setLoading, setError } = feedbackSlice.actions;
export default feedbackSlice.reducer;
