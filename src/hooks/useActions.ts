import { startQuiz } from "../redux/slices/quizSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { startQuestionTimer, startQuizTimer } from "../redux/timerSideEffects";

export const useActions = () => {
  const dispatch = useAppDispatch();
  const currentQuestionId = useAppSelector((state) => {
    if (state.quiz.quizData && state.quiz.currentQuestionIndex !== undefined) {
      return state.quiz.quizData.questions[state.quiz.currentQuestionIndex - 1]
        .id;
    }
    return "";
  });
  const startQuizAction = () => {
    dispatch(startQuiz());
    startQuizTimer(dispatch);
    startQuestionTimer(dispatch, currentQuestionId);
  };
  return { startQuizAction };
};
