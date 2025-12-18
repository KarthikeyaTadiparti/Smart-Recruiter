import { Get } from "@/lib/api-calls";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const _getInterview = createAsyncThunk<any, any>('getInterview', async (data: any) => {
    const response = await Get(`/interviews/`, data.id, data.navigate);
    return response
}); 