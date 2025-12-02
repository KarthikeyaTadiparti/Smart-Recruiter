import { Post } from "@/lib/api-calls"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const _generateQuestions = createAsyncThunk<any, any>('generateQuestions', async (data: any) => {
    const response: any = await Post(`/interviews/generate`, data.data, data.navigate)
    return response
})