import { Get, Post } from "@/lib/api-calls";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const _getInterview = createAsyncThunk<any, any>('getInterview', async (data: any) => {
    const response = await Get(`/interviews/`, data.id, data.navigate);
    return response
}); 

export const _saveConversation = createAsyncThunk<any, any>('saveConversation', async (data: any) => {
    const response = await Post(`/interviews`, data.data, data.navigate);
    return response
});