import { createContext, useContext } from "react";

interface PropsContext {
  preventAnswersToOtherThanCurrent?: boolean;
}

export const PropsContext = createContext<PropsContext | null>(null);

export const useProps = () => {
  const context = useContext(PropsContext);
  if (!context) {
    throw new Error("useProps must be used within a PropsProvider");
  }
  return context;
};
