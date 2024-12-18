import { useTimerManager } from "../redux";
import {
  answerAction,
  calculatePointsAction,
  finishQuizAction,
  nextQuestionAction,
  prevQuestionAction,
  startQuizAction,
} from "../redux/slices/quizSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export const useActions = () => {
  const dispatch = useAppDispatch();
  const timerManager = useTimerManager();
  const quizData = useAppSelector((state) => state.quiz.quizData);
  const currentQuestionIndex = useAppSelector(
    (state) => state.quiz.currentQuestionIndex
  );
  const status = useAppSelector((state) => state.quiz.status);

  // Helper function to get question ID by relative index
  const getQuestionId = (offset: number) => {
    if (quizData && currentQuestionIndex !== undefined) {
      const question = quizData.questions[currentQuestionIndex - 1 + offset];
      return question?.id || "";
    }
    return "";
  };
  const startQuiz = () => {
    const currentQuestionId = getQuestionId(0);
    if (status !== "started") {
      dispatch(startQuizAction());
      timerManager.startQuizTimer();
      timerManager.startQuestionTimer(currentQuestionId);
    } else {
      throw Error("Quiz have already started");
    }
  };
  const answerQuestion = (response: Partial<UserResponse>) => {
    dispatch(answerAction(response));
  };
  const nextQuestion = () => {
    const nextQuestionId = getQuestionId(1);
    if (nextQuestionId) {
      if (status === "started") {
        timerManager.clearAllQuestionTimers();
        timerManager.startQuestionTimer(nextQuestionId); // Start timer for the next question
        dispatch(nextQuestionAction());
      } else {
        throw Error("Quiz have not started yet");
      }
    } else {
      throw Error("There is no next question");
    }
  };

  const prevQuestion = () => {
    const prevQuestionId = getQuestionId(-1);
    if (prevQuestionId) {
      if (status === "started") {
        timerManager.clearAllQuestionTimers();
        timerManager.startQuestionTimer(prevQuestionId); // Start timer for the previous question
        dispatch(prevQuestionAction());
      } else {
        throw Error("Quiz have not started yet");
      }
    } else {
      throw Error("There is no previous question");
    }
  };
  const finishQuiz = () => {
    if (status === "started") {
      timerManager.clearAllQuestionTimers();
      timerManager.clearQuizTimer();
      dispatch(finishQuizAction());
      dispatch(calculatePointsAction());
    } else {
      throw Error("Quiz is not in started state");
    }
  };
  const calculatePoints = () => {
    dispatch(calculatePointsAction());
  };
  return {
    startQuiz,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    calculatePoints,
  };
};
