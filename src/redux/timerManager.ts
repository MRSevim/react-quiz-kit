import {
  decrementCurrentQuestionTimerAction,
  decrementQuizTimerAction,
} from "./slices/quizSlice";
import { useAppDispatch } from "./store";

export class TimerManager {
  private quizTimerInterval?: ReturnType<typeof setInterval>;
  private currentQuestionTimerInterval?: ReturnType<typeof setInterval>;

  constructor(private dispatch: ReturnType<typeof useAppDispatch>) {}

  startQuizTimer() {
    this.clearQuizTimer();
    this.clearCurrentQuestionTimer();
    this.quizTimerInterval = setInterval(() => {
      this.dispatch(decrementQuizTimerAction());
    }, 1000);
  }

  startCurrentQuestionTimer() {
    this.clearCurrentQuestionTimer();
    this.currentQuestionTimerInterval = setInterval(() => {
      this.dispatch(decrementCurrentQuestionTimerAction());
    }, 1000);
  }

  clearQuizTimer() {
    if (this.quizTimerInterval) {
      clearInterval(this.quizTimerInterval);
      this.quizTimerInterval = undefined;
    }
  }

  clearCurrentQuestionTimer() {
    if (this.currentQuestionTimerInterval) {
      clearInterval(this.currentQuestionTimerInterval);
      this.currentQuestionTimerInterval = undefined;
    }
  }
}
