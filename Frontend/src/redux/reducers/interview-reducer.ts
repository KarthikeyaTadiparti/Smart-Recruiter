// import { createSlice } from "@reduxjs/toolkit";
// import { _generateQuestions } from "../actions/interview-actions";

// interface QuestionStatusState {
//     loading: boolean;
//     error: string | null;
// }

// const initialState: QuestionStatusState = {
//     loading: false,
//     error: null,
// };

// const questionStatusSlice = createSlice({
//     name: "questionStatus",
//     initialState,
//     reducers: {
//         clearQuestionError(state) {
//             state.error = null;
//         },
//         resetQuestionStatus(state) {
//             state.loading = false;
//             state.error = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(_generateQuestions.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(_generateQuestions.fulfilled, (state) => {
//                 state.loading = false;
//                 state.error = null;
//             })
//             .addCase(_generateQuestions.rejected, (state, action: any) => {
//                 state.loading = false;

//                 const message =
//                     (action.payload && (action.payload.message ?? action.payload)) ??
//                     action.error?.message ??
//                     "Something went wrong";

//                 state.error = typeof message === "string" ? message : JSON.stringify(message);
//             });
//     },
// });

// export const { clearQuestionError, resetQuestionStatus } = questionStatusSlice.actions;
// export default questionStatusSlice.reducer;
