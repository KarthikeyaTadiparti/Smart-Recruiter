import { createSlice } from "@reduxjs/toolkit";
import { _getInterview } from "../actions/interview-actions";
import { Interview } from "@/types/types";


interface InterviewInitialStateType {
    loading: {
        fetch: boolean;
    };
    error: string | null;
    interview: Interview;
}

const initialState: InterviewInitialStateType = {
    loading: {
        fetch: false,
    },
    error: null,
    interview: {
        jobId: 0,
        jobRole: "",
        interviewType: "",
        interviewDuration: 0,
        questions: [],
        noOfQuestions: 0
    }
};

const interviewSlice = createSlice({
    name: "interviews",
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {
        builder 
            .addCase(_getInterview.pending,(state)=>{
                state.loading.fetch = true
                // console.log(true);
            })
            .addCase(_getInterview.fulfilled,(state,action)=>{
                state.loading.fetch = false
                state.interview = action.payload.data.interview
                // console.log(false)
            })
            .addCase(_getInterview.rejected,(state,action)=>{
                state.loading.fetch = false
                state.error = action.error.message || "Please Try Again"
            })
    },
});

export default interviewSlice.reducer