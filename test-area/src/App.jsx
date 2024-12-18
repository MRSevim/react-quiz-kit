import { useState } from "react";
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
        correctAnswer: "true",
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
        text: "Which is number?",
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
  const questions = useQuiz((state) => state.quiz.quizData.questions);
  const score = useQuiz((state) => state.quiz.score);
  const { startQuiz, finishQuiz } = useActions();

  return (
    <>
      <QuizTimer />
      {score !== undefined && <>--Score:{score}</>}
      <button onClick={() => startQuiz()}>Start</button>
      {questions.map((item, i) => {
        return (
          <div key={item.id}>
            {i + 1}. {item.text} {"  "}
            <QuestionTimer item={item} />
            <br></br>
            <Question item={item} id={id} />
          </div>
        );
      })}
      <button
        onClick={() => {
          finishQuiz();
        }}
      >
        Finish
      </button>
      <br></br>
    </>
  );
};

const Question = ({ item, id }) => {
  const [answer, setAnswer] = useState("");
  const { answerQuestion, nextQuestion, prevQuestion } = useActions();
  return (
    <>
      {item.type === "multiple-choice" &&
        item.options.map((option) => (
          <div key={option}>
            <input
              type={Array.isArray(item.correctAnswer) ? "checkbox" : "radio"}
              id={id + item.id + option}
              name={
                Array.isArray(item.correctAnswer)
                  ? id + item.id + option
                  : id + item.id
              }
              value={option}
              onChange={(e) => {
                if (Array.isArray(item.correctAnswer)) {
                  setAnswer((prev) => {
                    const answer = prev ? [...prev] : [];
                    if (answer.includes(e.target.value)) {
                      return answer.filter((value) => value !== e.target.value);
                    } else {
                      return [...answer, e.target.value];
                    }
                  });
                } else {
                  setAnswer(e.target.value);
                }
              }}
            ></input>
            <label htmlFor={id + item.id + option}>{option}</label>
          </div>
        ))}
      {item.type === "true-false" && (
        <>
          <input
            type="checkbox"
            id={id + item.id}
            onChange={(e) => {
              setAnswer(e.target.checked === true ? "true" : "false");
            }}
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
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
          ></input>
          <br></br>
        </>
      )}
      <button
        onClick={() => {
          prevQuestion();
        }}
      >
        {" "}
        Prev question
      </button>
      <button
        onClick={() => {
          answerQuestion({ questionId: item.id, selectedAnswer: answer });
        }}
      >
        {" "}
        Answer
      </button>
      <button
        onClick={() => {
          nextQuestion();
        }}
      >
        {" "}
        Next question
      </button>
    </>
  );
};

const QuizTimer = () => {
  const timer = useQuiz((state) => state.quiz.timer);
  return (
    <>
      Quiztimer: <Timer timer={timer} />
    </>
  );
};

const QuestionTimer = ({ item }) => {
  const timer = useQuiz(
    (state) =>
      state.quiz.questionTimers.find((timer) => timer.questionId === item.id)
        ?.timer
  );

  return (
    <>
      Timer:
      <Timer timer={timer} />
    </>
  );
};

const Timer = ({ timer }) => {
  return (
    <>
      {timer !== undefined && timer}
      {timer == undefined && "No timer"}
    </>
  );
};

export default App;
