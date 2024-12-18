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
      state.questionTimers = [];
      state.userResponses = [];
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
    finishQuizAction: (state) => {
      state.status = "finished";
    },
    calculatePointsAction: (state) => {
      let atLeastOnePointsExist = false;
      let totalScore = 0;
      state.userResponses?.forEach((response) => {
        const found = state.quizData?.questions.find(
          (question) => question.id === response.questionId
        );
        if (found && found.points !== undefined) {
          atLeastOnePointsExist = true;
          if (response.isCorrect) {
            totalScore += found.points;
          }
        }
      });
      if (atLeastOnePointsExist) {
        state.score = totalScore;
      }
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
    nextQuestionAction: (state) => {
      if (
        state.currentQuestionIndex !== undefined &&
        state.maxVisibleQuestionIndex !== undefined
      ) {
        state.currentQuestionIndex += 1;
        state.maxVisibleQuestionIndex += 1;
      }
    },
    prevQuestionAction: (state) => {
      if (
        state.currentQuestionIndex !== undefined &&
        state.maxVisibleQuestionIndex !== undefined
      ) {
        state.currentQuestionIndex -= 1;
      }
    },
    answerAction: (state, action: PayloadAction<Partial<UserResponse>>) => {
      const { questionId, selectedAnswer } = action.payload;
      if (!questionId || selectedAnswer === undefined) {
        throw Error("Please send in questionId and selectedAnswer");
      }
      let isCorrect;
      const question = state.quizData?.questions.find(
        (question) => question.id === questionId
      );
      if (!question) {
        throw Error("Question not found");
      }
      if (
        Array.isArray(question?.correctAnswer) &&
        Array.isArray(selectedAnswer)
      ) {
        isCorrect =
          selectedAnswer.every((answer) =>
            question.correctAnswer.includes(answer)
          ) &&
          question.correctAnswer.every((answer) =>
            selectedAnswer.includes(answer)
          );
      } else if (
        Array.isArray(question?.correctAnswer) &&
        !Array.isArray(selectedAnswer)
      ) {
        isCorrect = false;
      } else {
        isCorrect = question.correctAnswer === selectedAnswer;
      }
      if (state.status === "started" && state.userResponses) {
        const indexAnswerIndex = state.userResponses.findIndex(
          (response) => response.questionId === questionId
        );
        const userResponse = { questionId, selectedAnswer, isCorrect };

        if (indexAnswerIndex !== -1) {
          state.userResponses[indexAnswerIndex] = userResponse; // Replace the item at the found index
        } else {
          state.userResponses.push(userResponse);
        }
      } else {
        throw Error("Quiz have not started yet");
      }
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
  nextQuestionAction,
  prevQuestionAction,
  finishQuizAction,
  calculatePointsAction,
} = quizSlice.actions;

export default quizSlice.reducer;

let quizTimerInterval: ReturnType<typeof setInterval>;
