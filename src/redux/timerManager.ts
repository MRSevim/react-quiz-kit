import {
  decrementQuestionTimerAction,
  decrementQuizTimerAction,
} from "./slices/quizSlice";
import { useAppDispatch } from "./store";

export class TimerManager {
  private quizTimerInterval?: ReturnType<typeof setInterval>;
  private questionTimerIntervals: {
    questionId: string;
    interval: ReturnType<typeof setInterval>;
  }[] = [];

  constructor(private dispatch: ReturnType<typeof useAppDispatch>) {}

  startQuizTimer() {
    this.clearQuizTimer();
    this.quizTimerInterval = setInterval(() => {
      this.dispatch(decrementQuizTimerAction());
    }, 1000);
  }

  clearQuizTimer() {
    if (this.quizTimerInterval) {
      clearInterval(this.quizTimerInterval);
      this.quizTimerInterval = undefined;
    }
  }

  startQuestionTimer(questionId: string) {
    this.clearQuestionTimer(questionId);
    const interval = setInterval(() => {
      this.dispatch(decrementQuestionTimerAction());
    }, 1000);
    this.questionTimerIntervals.push({ questionId, interval });
  }

  clearQuestionTimer(questionId: string) {
    const timerIndex = this.questionTimerIntervals.findIndex(
      (item) => item.questionId === questionId
    );
    if (timerIndex !== -1) {
      clearInterval(this.questionTimerIntervals[timerIndex].interval);
      this.questionTimerIntervals.splice(timerIndex, 1);
    }
  }

  clearAllQuestionTimers() {
    this.questionTimerIntervals.forEach(({ interval }) => {
      clearInterval(interval);
    });
    this.questionTimerIntervals = [];
  }
}
