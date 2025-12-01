import { GetAll, Post } from "@/lib/api-calls"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const _userLogin = createAsyncThunk<any, any>('userLogin', async (data: any) => {
    const response: any = await Post(`/auth/login`, data.data, data.navigate)
    return response
})

export const _userSignup = createAsyncThunk<any, any>('userSignup', async (data: any) => {
    const response: any = await Post(`/auth/signup`, data.data, data.navigate)
    return response
})

export const _userLogout = createAsyncThunk<any, any>('userLogout', async (data: any) => {
    const response = await GetAll(`/auth/logout`, data.navigate)
    return response
})

export const _createCompany = createAsyncThunk<any, any>('createCompany', async (data: any) => {
    const response: any = await Post(`/companies`, data.data, data.navigate)
    return response
})