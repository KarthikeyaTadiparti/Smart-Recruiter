import { createSlice } from "@reduxjs/toolkit";
import { _createCompany, _userLogin, _userLogout, _userSignup } from "../actions/auth-actions";

interface AuthInitialStateType {
    loading: {
        login: boolean,
        signup: boolean,
        logout: boolean,
        fetchCompany: boolean
    },
    error: string | null,
    userData: {
        id: number | null
        name: string | null
        email: string | null
        role: string | null
        company: {
            id: number | null,
            name: string | null,
            website: string | null,
            description: string | null,
        }
    }
}
const initialState: AuthInitialStateType = {
    loading: {
        login: false,
        signup: false,
        logout: false,
        fetchCompany: false
    },
    error: null,
    userData: {
        id: null,
        name: null,
        email: null,
        role: null,
        company: {
            id: null,
            name: null,
            website: null,
            description: null
        }
    }
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            //Login
            .addCase(_userLogin.pending, (state) => {
                state.loading.login = true
            })
            .addCase(_userLogin.fulfilled, (state, action) => {
                state.loading.login = false
                // console.log("action.payload : ", action.payload);
                state.userData = action.payload.data.user;
            })
            .addCase(_userLogin.rejected, (state, action) => {
                state.loading.login = false
                state.error = action.error.message || "Please Try Again"
            })
            //Signup
            .addCase(_userSignup.pending, (state) => {
                state.loading.signup = true
            })
            .addCase(_userSignup.fulfilled, (state, action) => {
                state.loading.signup = false
                state.userData = action.payload.data.user
            })
            .addCase(_userSignup.rejected, (state, action) => {
                state.loading.signup = false
                state.error = action.error.message || "Please Try Again"
            })
            //logout
            .addCase(_userLogout.pending, (state) => {
                state.loading.logout = true
            })
            .addCase(_userLogout.fulfilled, (state) => {
                state.loading.logout = false
                state.userData = initialState.userData
            })
            .addCase(_userLogout.rejected, (state, action) => {
                state.loading.logout = false
                state.error = action.error.message || "Please Try Again"
            })

            //fetch company
            .addCase(_createCompany.pending, (state) => {
                state.loading.fetchCompany = true
            })
            .addCase(_createCompany.fulfilled, (state, action) => {
                state.loading.fetchCompany = false
                state.userData.company = action.payload.data.company
            })
            .addCase(_createCompany.rejected, (state,action) => {
                state.loading.fetchCompany = false
                state.error = action.error.message || "Please Try Again"

            })
    },
})

export default authSlice.reducer