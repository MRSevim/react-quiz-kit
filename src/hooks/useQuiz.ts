import { RootState, useAppSelector } from "../redux/store";

export const useQuiz = (func: (state: RootState) => RootState) => {
  const quiz = useAppSelector((state) => func(state));
  return quiz;
};
