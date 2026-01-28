import { Get, Post } from "@/lib/api-calls";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const _getApplication = createAsyncThunk<any, any>("getApplication", async (data: any) => {
    const response = await Get(`/applications/`, data.id, data.navigate);
    return response;
});

export const _getApplicationsByJobId = createAsyncThunk<any, any>("getApplicationsByJobId", async (data: any) => {
    const response = await Get(`/applications/job/`, data.id, data.navigate);
    return response;
});

export const _getApplicationsByCandidateId = createAsyncThunk<any, any>("getApplicationsByCandidateId", async (data: any) => {
    const response = await Get(`/applications/candidate/`, data.id, data.navigate);
    return response;
});

export const _saveConversation = createAsyncThunk<any, any>('saveConversation', async (data: any) => {
    const response = await Post(`/applications`, data.data, data.navigate);
    return response
});
