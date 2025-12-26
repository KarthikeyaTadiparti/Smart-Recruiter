import { Get, Post } from "@/lib/api-calls";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const _getFeedback = createAsyncThunk<any, any>("getFeedback", async (data: any) => {
    const response = await Get(`/feedbacks/`, data.id, data.navigate);
    return response;
});

export const _getFeedbacksByJobId = createAsyncThunk<any, any>("getFeedbacksByJobId", async (data: any) => {
    const response = await Get(`/feedbacks/job/`, data.id, data.navigate);
    return response;
});

export const _getFeedbacksByCandidateId = createAsyncThunk<any, any>("getFeedbacksByCandidateId", async (data: any) => {
    const response = await Get(`/feedbacks/candidate/`, data.id, data.navigate);
    return response;
});

export const _saveConversation = createAsyncThunk<any, any>('saveConversation', async (data: any) => {
    const response = await Post(`/feedbacks`, data.data, data.navigate);
    return response
});
