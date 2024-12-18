import { useTimerManager } from "../redux";
import { answerAction, startQuizAction } from "../redux/slices/quizSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export const useActions = () => {
  const dispatch = useAppDispatch();
  const timerManager = useTimerManager();
  const currentQuestionId = useAppSelector((state) => {
    if (state.quiz.quizData && state.quiz.currentQuestionIndex !== undefined) {
      return state.quiz.quizData.questions[state.quiz.currentQuestionIndex - 1]
        .id;
    }
    return "";
  });
  const startQuiz = () => {
    dispatch(startQuizAction());
    timerManager.startQuizTimer();
    timerManager.startQuestionTimer(currentQuestionId);
  };
  const answerQuestion = (response: UserResponse) => {
    dispatch(answerAction(response));
  };
  return { startQuiz, answerQuestion };
};
