import { createContext, useContext } from "react";
import { TimerManager } from "../timerManager";

export const TimerManagerContext = createContext<TimerManager | null>(null);

export const useTimerManager = () => {
  const context = useContext(TimerManagerContext);
  if (!context) {
    throw new Error(
      "useTimerManager must be used within a TimerManagerProvider"
    );
  }
  return context;
};
