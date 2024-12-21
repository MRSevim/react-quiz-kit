import { RootState, useAppSelector } from "../redux/store";
import { QuizState } from "..";

export const useQuiz = <T>(selector: (state: QuizState) => T): T => {
  const quiz = useAppSelector((state: RootState) => selector(state.quiz));
  return quiz;
};
