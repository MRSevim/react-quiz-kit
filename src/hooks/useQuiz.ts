import { RootState, useAppSelector } from "../redux/store";

export const useQuiz = (func: (state: QuizState) => QuizState) => {
  const quiz = useAppSelector((state) => func(state.quiz));
  return quiz;
};
