import { Get } from "@/lib/api-calls";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const _getFeedback = createAsyncThunk<any, any>("getFeedback", async (data: any) => {
    const response = await Get(`/feedback/`, data.id, data.navigate);
    return response;
});

