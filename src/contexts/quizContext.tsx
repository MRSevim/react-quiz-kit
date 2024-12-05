import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";

const QuizContext = createContext<Quiz | null>(null);

export const QuizProvider = ({
  children,
  quiz,
}: {
  children: React.ReactNode;
  quiz: Quiz;
}) => {
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
  quiz: PropTypes.shape({
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
