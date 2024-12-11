import { decrementQuestionTimer, decrementQuizTimer } from "./slices/quizSlice";
import { useAppDispatch } from "./store";

let quizTimerInterval: ReturnType<typeof setInterval>;
let questionTimerIntervals: {
  questionId: string;
  interval: ReturnType<typeof setInterval>;
}[] = [];

const clearQuestionTimerIfExists = (questionId: string) => {
  questionTimerIntervals.forEach((item) => {
    if (item.questionId === questionId) {
      clearInterval(item.interval);
    }
  });
};
const addIntervalToQuestionIntervals = (
  questionId: string,
  interval: ReturnType<typeof setInterval>
) => {
  const found = questionTimerIntervals.find(
    (item) => item.questionId === questionId
  );
  if (found) {
    found.interval = interval;
  } else {
    questionTimerIntervals.push({ questionId, interval });
  }
};

export const startQuizTimer = (dispatch: ReturnType<typeof useAppDispatch>) => {
  clearInterval(quizTimerInterval);
  quizTimerInterval = setInterval(() => {
    dispatch(decrementQuizTimer());
  }, 1000);
};
export const startQuestionTimer = (
  dispatch: ReturnType<typeof useAppDispatch>,
  questionId: string
) => {
  clearQuestionTimerIfExists(questionId);
  const interval = setInterval(() => {
    dispatch(decrementQuestionTimer());
  }, 1000);
  addIntervalToQuestionIntervals(questionId, interval);
};
