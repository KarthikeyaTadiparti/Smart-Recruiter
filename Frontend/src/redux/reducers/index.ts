import { combineReducers, Reducer, UnknownAction } from "@reduxjs/toolkit";
import authSlice from './auth-reducer'
import jobSlice from './job-reducer'
export interface RootState {
    auth: ReturnType<typeof authSlice>
    job: ReturnType<typeof jobSlice>
}

const reducers = combineReducers({
    auth: authSlice,
    job: jobSlice
})

const rootReducer: Reducer<RootState, UnknownAction> = (state, action) => {
    if (action.type === 'userLogout/fulfilled') {
        return reducers(undefined, action)
    }

    return reducers(state, action)
}

export default rootReducer