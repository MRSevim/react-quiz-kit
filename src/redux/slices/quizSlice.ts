import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: QuizState = {};

export const quizSlice = createSlice({
  name: "quizState",
  initialState: initialState,
  reducers: {
    setInitialStateAction: (state, action: PayloadAction<QuizData>) => {
      const quizData = action.payload;
      state.quizData = quizData;
      state.currentQuestionIndex = 1;
      state.maxVisibleQuestionIndex = 1;
      state.status = "idle";
      state.score = 0;
      state.questionTimers = [];
      if (quizData.timeLimit !== undefined) {
        state.timer = quizData.timeLimit;
      }

      quizData.questions.forEach((question) => {
        if (question.timeLimit !== undefined) {
          state.questionTimers?.push({
            questionId: question.id,
            timer: question.timeLimit,
          });
        }
      });
    },
    startQuizAction: (state) => {
      state.status = "started";
    },
    decrementQuizTimerAction: (state) => {
      if (state.timer && state.timer > 0) {
        state.timer -= 1;
      }
    },
    decrementQuestionTimerAction: (state) => {
      if (state.currentQuestionIndex !== undefined && state.quizData) {
        const currentQuestionId =
          state.quizData.questions[state.currentQuestionIndex - 1].id;
        state.questionTimers?.forEach((item) => {
          if (
            item.questionId === currentQuestionId &&
            item.timer &&
            item.timer > 0
          ) {
            item.timer -= 1;
          }
        });
      }
    },
    answerAction: (state, action: PayloadAction<UserResponse>) => {
      const { questionId, selectedAnswer, isCorrect } = action.payload;
      console.log(questionId, selectedAnswer);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setInitialStateAction,
  decrementQuizTimerAction,
  decrementQuestionTimerAction,
  startQuizAction,
  answerAction,
} = quizSlice.actions;

export default quizSlice.reducer;

let quizTimerInterval: ReturnType<typeof setInterval>;
