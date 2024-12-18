import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { createQuizStore, useAppDispatch } from "./store";
import { setInitialStateAction } from "./slices/quizSlice";
import { TimerManager } from "./timerManager";

type Props = {
  children: React.ReactNode;
  quizData: QuizData;
};
const TimerManagerContext = createContext<TimerManager | null>(null);

export const useTimerManager = () => {
  const context = useContext(TimerManagerContext);
  if (!context) {
    throw new Error(
      "useTimerManager must be used within a TimerManagerProvider"
    );
  }
  return context;
};
export const QuizProvider = (props: Props) => {
  const store = React.useMemo(() => createQuizStore(), []); // Create a separate store for each provider
  return (
    <Provider store={store}>
      <QuizContextProvider {...props} />
    </Provider>
  );
};

const QuizContextProvider = ({ children, quizData }: Props) => {
  const dispatch = useAppDispatch();
  const timerManager = React.useMemo(
    () => new TimerManager(dispatch),
    [dispatch]
  );
  // Check for duplicate IDs in quizData.questions
  const ids = quizData.questions.map((question) => question.id);
  const uniqueIds = new Set(ids);

  if (uniqueIds.size !== ids.length) {
    throw new Error("Duplicate question IDs detected in quizData.");
  }

  dispatch(setInitialStateAction(quizData));
  console.log("QuizContextProvider renders");
  return (
    <TimerManagerContext.Provider value={timerManager}>
      {children}
    </TimerManagerContext.Provider>
  );
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
