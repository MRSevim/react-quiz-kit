import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import quizSlice from "./slices/quizSlice";

export const createQuizStore = () =>
  configureStore({
    reducer: {
      quiz: quizSlice,
    },
  });

// Infer types from the store created by `createQuizStore`
export type QuizStore = ReturnType<typeof createQuizStore>;
export type RootState = ReturnType<QuizStore["getState"]>;
export type AppDispatch = QuizStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
