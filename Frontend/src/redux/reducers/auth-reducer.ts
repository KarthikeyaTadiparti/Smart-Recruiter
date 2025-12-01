    import { createSlice } from "@reduxjs/toolkit";
    import { _createCompany, _userLogin, _userLogout, _userSignup } from "../actions/auth-actions";

    interface AuthInitialStateType {
        loading: {
            login: boolean,
            signup: boolean,
            logout: boolean
        },
        error: string | null,
        userData: any | null
    }
    const initialState: AuthInitialStateType = {
        loading: {
            login: false,
            signup: false,
            logout: false
        },
        error: null,
        userData: null
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
                    state.userData = action.payload
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
                    state.userData = action.payload
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
                    state.userData = null
                })
                .addCase(_userLogout.rejected, (state, action) => {
                    state.loading.logout = false
                    state.error = action.error.message || "Please Try Again"
                })
                .addCase(_createCompany.fulfilled, (state, action) => {
                    if (state.userData?.data && action.payload?.data?.company) {
                        state.userData.data.company = action.payload.data.company
                    }
                })
        },
    })

    export default authSlice.reducer