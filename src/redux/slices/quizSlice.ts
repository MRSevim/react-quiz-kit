import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: QuizState = {
  quizData: {
    title: "",
    questions: [],
  },
  currentQuestionIndex: 1,
  maxVisibleQuestionIndex: 1,
  status: "idle",
  questionTimers: [],
  userResponses: [],
};

export const quizSlice = createSlice({
  name: "quizState",
  initialState: initialState,
  reducers: {
    setInitialStateAction: (state, action: PayloadAction<QuizData>) => {
      const quizData = action.payload;
      state.quizData = quizData;

      if (quizData.timeLimit !== undefined) {
        state.timer = quizData.timeLimit;
      }
      state.status = "idle";
      state.currentQuestionIndex = 1;
      state.maxVisibleQuestionIndex = 1;
      state.score = undefined;
      state.questionTimers = [];
      state.userResponses = [];
      quizData.questions.forEach((question) => {
        if (question.timeLimit !== undefined) {
          state.questionTimers.push({
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
      state.userResponses.forEach((response) => {
        const found = state.quizData.questions.find(
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
    decrementCurrentQuestionTimerAction: (state) => {
      const currentQuestionId =
        state.quizData.questions[state.currentQuestionIndex - 1].id;
      state.questionTimers.forEach((item) => {
        if (item.questionId === currentQuestionId && item.timer > 0) {
          item.timer -= 1;
        }
      });
    },
    nextQuestionAction: (state) => {
      state.currentQuestionIndex += 1;
      if (state.maxVisibleQuestionIndex === state.currentQuestionIndex) {
        state.maxVisibleQuestionIndex += 1;
      }
    },
    prevQuestionAction: (state) => {
      state.currentQuestionIndex -= 1;
    },
    answerAction: (
      state,
      action: PayloadAction<{
        response: Partial<UserResponse>;
        preventAnswersToOtherThanCurrent?: boolean;
      }>
    ) => {
      startedCheck(state);
      const {
        response: { questionId, selectedAnswer },
        preventAnswersToOtherThanCurrent,
      } = action.payload;

      if (!questionId || selectedAnswer === undefined) {
        throw Error("Please send in questionId and selectedAnswer");
      }
      let isCorrect;
      const question = state.quizData.questions.find(
        (question) => question.id === questionId
      );
      if (!question) {
        throw Error("Question not found");
      }
      const questionIndex = state.quizData.questions.findIndex(
        (question) => question.id === questionId
      );
      if (
        questionIndex + 1 !== state.currentQuestionIndex &&
        preventAnswersToOtherThanCurrent
      ) {
        throw Error("Question you are answering is not current question");
      }
      if (
        Array.isArray(question.correctAnswer) &&
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
        Array.isArray(question.correctAnswer) &&
        !Array.isArray(selectedAnswer)
      ) {
        isCorrect = false;
      } else {
        isCorrect = question.correctAnswer === selectedAnswer;
      }
      startedCheck(state);
      const answerIndex = state.userResponses.findIndex(
        (response) => response.questionId === questionId
      );
      const userResponse = { questionId, selectedAnswer, isCorrect };

      if (answerIndex !== -1) {
        state.userResponses[answerIndex] = userResponse; // Replace the item at the found index
      } else {
        state.userResponses.push(userResponse);
      }
    },
    setQuizTimerAction: (state, action: PayloadAction<number>) => {
      startedCheck(state);
      if (state.quizData.timeLimit) {
        state.timer = action.payload;
      } else {
        throw Error("Quiz does not have timeLimit set");
      }
    },
    setQuestionTimerAction: (
      state,
      action: PayloadAction<SetQuestionTimerActionParam>
    ) => {
      const { questionId, timer } = action.payload;

      startedCheck(state);
      const timerIndex = state.questionTimers.findIndex(
        (response) => response.questionId === questionId
      );
      if (timerIndex !== -1) {
        state.questionTimers[timerIndex].timer = timer; // Replace the item at the found index
      } else {
        throw Error("Question does not have a timeLimit set");
      }
    },
    setScoreAction: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    setCurrentQuestionIndexAction: (state, action: PayloadAction<number>) => {
      startedCheck(state);
      state.currentQuestionIndex = action.payload;
    },
    setMaxVisibleQuestionIndexAction: (
      state,
      action: PayloadAction<number>
    ) => {
      state.maxVisibleQuestionIndex = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setScoreAction,
  setQuestionTimerAction,
  setMaxVisibleQuestionIndexAction,
  setCurrentQuestionIndexAction,
  setInitialStateAction,
  decrementQuizTimerAction,
  decrementCurrentQuestionTimerAction,
  startQuizAction,
  answerAction,
  nextQuestionAction,
  prevQuestionAction,
  finishQuizAction,
  calculatePointsAction,
  setQuizTimerAction,
} = quizSlice.actions;

export default quizSlice.reducer;

const startedCheck = (state: QuizState) => {
  if (state.status !== "started") {
    throw Error("Quiz have not started yet");
  }
};
