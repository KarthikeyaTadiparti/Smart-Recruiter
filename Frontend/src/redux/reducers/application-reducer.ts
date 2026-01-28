import { createSlice } from "@reduxjs/toolkit";
import { _getApplication, _getApplicationsByCandidateId, _getApplicationsByJobId, _saveConversation } from "../actions/application-actions";

interface ApplicationState {
    loading: {
        fetch: boolean;
        post: boolean;
    };
    error: any;
}

const initialState: ApplicationState = {
    loading: {
        fetch: false,
        post: false,
    },
    error: null,
};

const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get application by id
            .addCase(_getApplication.pending, (state) => {
                state.loading.fetch = true;
            })
            .addCase(_getApplication.fulfilled, (state) => {
                state.loading.fetch = false;
            })
            .addCase(_getApplication.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error.message;
            })

            // get applications by job id
            .addCase(_getApplicationsByJobId.pending, (state) => {
                state.loading.fetch = true;
            })
            .addCase(_getApplicationsByJobId.fulfilled, (state) => {
                state.loading.fetch = false;
            })
            .addCase(_getApplicationsByJobId.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error.message;
            })

            // get applications by candidate id
            .addCase(_getApplicationsByCandidateId.pending, (state) => {
                state.loading.fetch = true;
            })
            .addCase(_getApplicationsByCandidateId.fulfilled, (state) => {
                state.loading.fetch = false;
            })
            .addCase(_getApplicationsByCandidateId.rejected, (state, action) => {
                state.loading.fetch = false;
                state.error = action.error.message;
            })

            // save conversation
            .addCase(_saveConversation.pending, (state) => {
                state.loading.post = true;
            })
            .addCase(_saveConversation.fulfilled, (state) => {
                state.loading.post = false;
            })
            .addCase(_saveConversation.rejected, (state, action) => {
                state.loading.post = false;
                state.error = action.error.message;
            });
    }
});

export default applicationSlice.reducer;
