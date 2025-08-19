import { Post } from "@/lib/api-calls";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const _userLogin = createAsyncThunk<any, any>('userlogin', async (data: any) => {
    const response: any = await Post(`/user/login`, data.data, data.navigate)
    return response
});