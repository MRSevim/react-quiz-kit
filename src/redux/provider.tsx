import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { store, useAppDispatch } from "./store";
import { setInitialState } from "./slices/quizSlice";

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

  // Check for duplicate IDs in quizData.questions
  const ids = quizData.questions.map((question) => question.id);
  const uniqueIds = new Set(ids);

  if (uniqueIds.size !== ids.length) {
    throw new Error("Duplicate question IDs detected in quizData.");
  }

  dispatch(setInitialState(quizData));
  console.log("QuizContextProvider renders");
  return <>{children}</>;
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
        points: PropTypes.number.isRequired,
      })
    ).isRequired,
    timeLimit: PropTypes.number,
  }).isRequired,
};
