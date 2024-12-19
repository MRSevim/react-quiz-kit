import { useProps } from "../redux/contexts/PropsContext";
import { useTimerManager } from "../redux/contexts/TimerManagerContext";
import {
  answerAction,
  calculatePointsAction,
  finishQuizAction,
  nextQuestionAction,
  prevQuestionAction,
  setCurrentQuestionIndexAction,
  setMaxVisibleQuestionIndexAction,
  setQuestionTimerAction,
  setQuizTimerAction,
  setScoreAction,
  startQuizAction,
} from "../redux/slices/quizSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export const useActions = () => {
  const dispatch = useAppDispatch();
  const timerManager = useTimerManager();
  const props = useProps();
  const quizData = useAppSelector((state) => state.quiz.quizData);
  const currentQuestionIndex = useAppSelector(
    (state) => state.quiz.currentQuestionIndex
  );
  const status = useAppSelector((state) => state.quiz.status);

  // Helper function to get question ID by index
  const getQuestionId = (index: number) => {
    const question = quizData.questions[index - 1];
    return question?.id || "";
  };

  const startQuiz = () => {
    if (status !== "started") {
      dispatch(startQuizAction());
      timerManager.startQuizTimer();
      timerManager.startCurrentQuestionTimer();
    } else {
      throw Error("Quiz have already started");
    }
  };

  const answerQuestion = (response: Partial<UserResponse>) => {
    dispatch(
      answerAction({
        response,
        preventAnswersToOtherThanCurrent:
          props.preventAnswersToOtherThanCurrent,
      })
    );
  };

  const nextQuestion = () => {
    const nextQuestionId = getQuestionId(currentQuestionIndex + 1);
    if (nextQuestionId) {
      if (status === "started") {
        dispatch(nextQuestionAction());
        timerManager.startCurrentQuestionTimer();
      } else {
        throw Error("Quiz have not started yet");
      }
    } else {
      throw Error("There is no next question");
    }
  };

  const prevQuestion = () => {
    const prevQuestionId = getQuestionId(currentQuestionIndex - 1);
    if (prevQuestionId) {
      if (status === "started") {
        dispatch(prevQuestionAction());
        timerManager.startCurrentQuestionTimer();
      } else {
        throw Error("Quiz have not started yet");
      }
    } else {
      throw Error("There is no previous question");
    }
  };

  const finishQuiz = () => {
    if (status === "started") {
      timerManager.clearCurrentQuestionTimer();
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

  const setQuizTimer = (number: number) => {
    dispatch(setQuizTimerAction(number));
  };

  const setQuestionTimer = (param: SetQuestionTimerActionParam) => {
    dispatch(setQuestionTimerAction(param));
  };

  const setScore = (number: number) => {
    dispatch(setScoreAction(number));
  };

  const setCurrentQuestionIndex = (index: number) => {
    const questionId = getQuestionId(index);
    if (questionId) {
      if (status === "started") {
        if (currentQuestionIndex !== index) {
          dispatch(setCurrentQuestionIndexAction(index));
          timerManager.startCurrentQuestionTimer();
        }
      } else {
        throw Error("Quiz have not started yet");
      }
    } else {
      throw Error("There is no question with that index");
    }
  };

  const setMaxVisibleQuestionIndex = (index: number) => {
    const questionId = getQuestionId(index);
    if (questionId) {
      dispatch(setMaxVisibleQuestionIndexAction(index));
    } else {
      throw Error("There is no question with that index");
    }
  };

  return {
    setCurrentQuestionIndex,
    setMaxVisibleQuestionIndex,
    setScore,
    setQuestionTimer,
    startQuiz,
    setQuizTimer,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    calculatePoints,
  };
};
