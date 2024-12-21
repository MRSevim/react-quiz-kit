import { useState } from "react";
import {
  Question,
  QuizData,
  QuizProvider,
  QuizState,
  useActions,
  useQuiz,
} from "react-quiz-kit";

const quizData: QuizData = {
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

const App = () => {
  return (
    <QuizProvider quizData={quizData} preventAnswersToOtherThanCurrent={true}>
      <Inner />
    </QuizProvider>
  );
};

const Inner = () => {
  const questions = useQuiz((state) => state.quizData.questions);
  const score = useQuiz((state) => state.score);

  const { startQuiz, finishQuiz, resetQuiz } = useActions();

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
            <QuestionComp item={item} />
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
      <button
        onClick={() => {
          resetQuiz();
        }}
      >
        Reset
      </button>
      <br></br>
    </>
  );
};

const QuestionComp = ({ item }: { item: Question }) => {
  const [answer, setAnswer] = useState<string | string[]>("");
  const { answerQuestion, nextQuestion, prevQuestion } = useActions();
  return (
    <>
      {item.type === "multiple-choice" &&
        item.options &&
        item.options.map((option) => (
          <div key={option}>
            <input
              type={Array.isArray(item.correctAnswer) ? "checkbox" : "radio"}
              id={item.id + option}
              name={
                Array.isArray(item.correctAnswer) ? item.id + option : item.id
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
            <label htmlFor={item.id + option}>{option}</label>
          </div>
        ))}
      {item.type === "true-false" && (
        <>
          <input
            type="checkbox"
            id={item.id}
            onChange={(e) => {
              setAnswer(e.target.checked === true ? "true" : "false");
            }}
          ></input>
          <label htmlFor={item.id}>Check if true</label>
          <br></br>
        </>
      )}
      {item.type === "short-answer" && (
        <>
          <input
            type="text"
            id={item.id}
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
  const timer = useQuiz((state) => state.timer);
  return (
    <>
      Quiztimer: <Timer timer={timer} />
    </>
  );
};

const QuestionTimer = ({ item }: { item: Question }) => {
  const timer = useQuiz(
    (state) =>
      state.questionTimers.find((timer) => timer.questionId === item.id)?.timer
  );

  return (
    <>
      Timer:
      <Timer timer={timer} />
    </>
  );
};

const Timer = ({ timer }: { timer: QuizState["timer"] }) => {
  return (
    <>
      {timer !== undefined && timer}
      {timer == undefined && "No timer"}
    </>
  );
};

export default App;
