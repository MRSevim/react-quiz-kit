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
        text: "Is 2+2=4?",
        type: "true-false",
        correctAnswer: "4",
        points: 5,
        timeLimit: 60,
      },
      {
        id: "q3",
        text: "What is 2+2?",
        type: "short-answer",
        correctAnswer: "4",
        points: 5,
        timeLimit: 60,
      },
      {
        id: "q4",
        text: "Which is number",
        type: "multiple-choice",
        options: ["3", "4"],
        correctAnswer: ["3", "4"],
        points: 5,
        timeLimit: 60,
      },
    ],
    timeLimit: 60,
  };
  return (
    <>
      <QuizProvider quizData={quizData}>
        <InnerApp id={1} />
      </QuizProvider>
      <QuizProvider quizData={quizData}>
        <InnerApp id={2} />
      </QuizProvider>
    </>
  );
}
const InnerApp = ({ id }) => {
  const quiz = useQuiz((state) => state.quiz);
  const { startQuiz } = useActions();

  return (
    <>
      Quiztimer: {quiz.timer} <br></br>
      <button onClick={() => startQuiz()}>Start</button>
      {quiz.quizData.questions.map((item) => {
        const found = quiz.questionTimers.find(
          (timer) => timer.questionId === item.id
        );
        return (
          <div key={item.id}>
            {found && found.timer}
            {!found && "No timer"}
            <br></br>
            {item.text}
            <br></br>
            {item.type === "multiple-choice" &&
              item.options.map((option, i) => (
                <div key={option}>
                  <input
                    type="radio"
                    id={id + item.id + option}
                    name={
                      Array.isArray(item.correctAnswer)
                        ? id + option
                        : id + item.id
                    }
                    value={option}
                  ></input>
                  <label htmlFor={option}>{option}</label>
                </div>
              ))}
            {item.type === "true-false" && (
              <>
                <input
                  type="checkbox"
                  id={id + item.id}
                  name={id + item.id}
                  value="true"
                ></input>
                <label htmlFor={id + item.id}>Check if true</label>
                <br></br>
              </>
            )}
            {item.type === "short-answer" && (
              <>
                <input
                  type="text"
                  id={id + item.id}
                  name={id + item.id}
                ></input>
                <br></br>
              </>
            )}
            <button onClick={() => {}}> Answer</button>
          </div>
        );
      })}
      <button onClick={() => {}}>Finish</button>
      <br></br>
    </>
  );
};

export default App;
