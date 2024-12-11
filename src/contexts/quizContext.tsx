import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { store, useAppSelector, useAppDispatch } from "../redux/store";
import { setInitialState } from "../redux/slices/quizSlice";

const QuizContext = createContext<QuizState | null>(null);

type Props = {
  children: React.ReactNode;
  quizData: QuizData;
};

export const QuizProvider = (props: Props) => {
  return (
    <Provider store={store}>
      <QuizContextProvider {...props} />
    </Provider>
  );
};

const QuizContextProvider = ({ children, quizData }: Props) => {
  const dispatch = useAppDispatch();
  dispatch(setInitialState(quizData));
  const quiz = useAppSelector((state) => state.quiz);
  return <QuizContext.Provider value={quiz}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
// Adding PropTypes validation for runtime
QuizProvider.propTypes = {
  quizData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["multiple-choice", "true-false", "short-answer"])
          .isRequired,
        options: PropTypes.arrayOf(PropTypes.string),
        correctAnswer: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
        ]).isRequired,
        explanation: PropTypes.string,
        timeLimit: PropTypes.number,
      })
    ).isRequired,
    timeLimit: PropTypes.number,
  }).isRequired,
};
