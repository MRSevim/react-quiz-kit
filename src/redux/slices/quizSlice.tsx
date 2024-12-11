import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: QuizState = {
  quizData: null,
  currentQuestionIndex: null,
  userResponses: null,
  score: null,
};
export const quizSlice = createSlice({
  name: "quizState",
  initialState: initialState,
  reducers: {
    setInitialState: (state, action: PayloadAction<QuizData>) => {
      state.quizData = action.payload;
      state.currentQuestionIndex = 1;
      state.score = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setInitialState } = quizSlice.actions;

export default quizSlice.reducer;
