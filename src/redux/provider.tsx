import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { createQuizStore, useAppDispatch } from "./store";
import { setInitialStateAction } from "./slices/quizSlice";
import { TimerManager } from "./timerManager";
import { TimerManagerContext } from "./contexts/TimerManagerContext";
import { PropsContext } from "./contexts/PropsContext";
import { QuizData } from "..";

type Props = {
  children: React.ReactNode;
  quizData: QuizData;
  preventAnswersToOtherThanCurrent?: boolean;
};

export const QuizProvider = (props: Props) => {
  const store = React.useMemo(() => createQuizStore(), []); // Create a separate store for each provider
  return (
    <Provider store={store}>
      <QuizContextProvider {...props} />
    </Provider>
  );
};

const QuizContextProvider = ({
  children,
  quizData,
  preventAnswersToOtherThanCurrent,
}: Props) => {
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
  return (
    <TimerManagerContext.Provider value={timerManager}>
      <PropsContext.Provider value={{ preventAnswersToOtherThanCurrent }}>
        {children}
      </PropsContext.Provider>
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
        incorrectMessage: PropTypes.string,
        timeLimit: PropTypes.number,
        points: PropTypes.number,
      })
    ).isRequired,
    timeLimit: PropTypes.number,
  }).isRequired,
};
