import { GetAll, Post } from "@/lib/api-calls"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const _createJob = createAsyncThunk<any, any>('createJob', async (data: any) => {
    const response: any = await Post(`/jobs`, data.data, data.navigate)
    return response
})