import { Post, Patch, GetAll } from "@/lib/api-calls"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const _generateQuestions = createAsyncThunk<any, any>('generateQuestions', async (data: any) => {
    const response: any = await Post(`/interviews/generate`, data.data, data.navigate)
    return response
})

export const _createInterview = createAsyncThunk<any, any>("createInterview", async (data: any) => {
    const response: any = await Patch(`/interviews/`, data.id, data.questions, data.navigate);
    return response;
});

export const _getAllJobs = createAsyncThunk<any, any>("getAllJobs", async (data: any) => {
    const response: any = await GetAll(`/jobs`, data.navigate);
    return response;
});