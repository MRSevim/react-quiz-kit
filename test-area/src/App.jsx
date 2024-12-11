import { QuizProvider, useQuiz } from "react-quiz-kit";

function App() {
  const quizData = {
    title: "Sample Quiz",
    questions: [
      {
        id: "q1",
        text: "What is 2+2?",
        type: "multiple-choice",
        options: ["3", "4"],
        correctAnswer: "4",
      },
    ],
  };
  return (
    <QuizProvider quizData={quizData}>
      <InnerApp />
    </QuizProvider>
  );
}
const InnerApp = () => {
  const quiz = useQuiz();
  return <>{quiz.quiz.title}</>;
};

export default App;
