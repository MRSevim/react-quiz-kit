import { QuizProvider, useQuiz, useActions } from "react-quiz-kit";

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
        points: 5,
        timeLimit: 60,
      },
      {
        id: "q2",
        text: "What is 2+2?",
        type: "multiple-choice",
        options: ["3", "4"],
        correctAnswer: "4",
        points: 5,
        timeLimit: 60,
      },
      {
        id: "q3",
        text: "What is 2+2?",
        type: "multiple-choice",
        options: ["3", "4"],
        correctAnswer: "4",
        points: 5,
        timeLimit: 60,
      },
    ],
    timeLimit: 60,
  };
  return (
    <QuizProvider quizData={quizData}>
      <InnerApp />
    </QuizProvider>
  );
}
const InnerApp = () => {
  const quiz = useQuiz((state) => state.quiz);
  const { startQuizAction } = useActions();

  return (
    <>
      Quiztimer: {quiz.timer} <br></br>
      <button onClick={() => startQuizAction()}>Start</button>
      {quiz.quizData.questions.map((item) => {
        const found = quiz.questionTimers.find(
          (timer) => timer.questionId === item.id
        );
        return (
          <div key={item.id}>
            {found && found.timer}
            {!found && "No timer"}
          </div>
        );
      })}
    </>
  );
};

export default App;
