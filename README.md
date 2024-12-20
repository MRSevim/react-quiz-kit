# React Quiz Kit

`react-quiz-kit` is a simple, lightweight hook library for creating quizzes on react. It provides `QuizProvider` component that should wrap your quiz and 2 hooks ,`useQuiz` and `useActions`, that are respectively for reading and mutating quiz data.

## Features

- `QuizProvider` wrapper component that takes in `quizData` and optional `preventAnswersToOtherThanCurrent` props
- 2 hooks for accessing and manipulating quiz data.
- Optional timer management (in seconds) for overall quiz and individual questions.
- Optional score management for the quiz.
- Built-in actions for navigating, answering, and scoring quizzes.
- Developer-friendly error handling.

## Installation

Install the library via npm or yarn:

```bash
npm install react-quiz-kit
# or
yarn add react-quiz-kit
```

## Example Usage in Js

```jsx
import { useState } from "react";
import { QuizProvider, useActions, useQuiz } from "../../dist";

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

export const SimpleDemonstration = () => {
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
            <Question item={item} />
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

const Question = ({ item }) => {
  const [answer, setAnswer] = useState("");
  const { answerQuestion, nextQuestion, prevQuestion } = useActions();
  return (
    <>
      {item.type === "multiple-choice" &&
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

const QuestionTimer = ({ item }) => {
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

const Timer = ({ timer }) => {
  return (
    <>
      {timer !== undefined && timer}
      {timer == undefined && "No timer"}
    </>
  );
};
```

# API Reference

## QuizProvider component

This is a react component that should wrap your entire quiz. It takes in 2 props. One is `quizData` (necessary, should be in the QuizData shape that has the Typescript interface in below section) and optional `preventAnswersToOtherThanCurrent` (if true, trying to answer a question other than the current question will raise an error).

## useQuiz hook

This is the hook that is used to read the data from the state. It uses redux-toolkit under the hood. Shape of the parameter (`state` in the example) is, Typescript interface called `QuizState`, provided in section below.

```jsx
//example usage
import { useQuiz } from "react-quiz-kit";

const score = useQuiz((state) => state.score);

return <>{score !== undefined && <>Score:{score}</>}</>;
```

## useAction hook

This is a hook that provided miscellaneous actions that mutates your `QuizState`. You should check the Typescript interfaces provided below to better understand this section.

```jsx
//example usage
import { useActions } from "react-quiz-kit";

const { finishQuiz } = useActions();
return (
  <button
    onClick={() => {
      finishQuiz();
    }}
  >
    Finish
  </button>
);
```

<table>
  <thead>
    <tr>
      <th>Function</th>
      <th>What it does</th>
      <th>Parameters</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>setCurrentQuestionIndex</td>
      <td>Sets the currentQuestionIndex to the provided number. Also starts the timer for the question set and stops other timers.</td>
      <td><code>index: number</code> - The index to set as the current question.</td>
    </tr>
    <tr>
      <td>setMaxVisibleQuestionIndex</td>
      <td>Sets the maxVisibleQuestionIndex to the provided number.</td>
      <td><code>index: number</code> - The index to set as the maximum visible question.</td>
    </tr>
    <tr>
      <td>setScore</td>
      <td>Sets the score to the provided number.</td>
      <td><code>score: number</code> - The score to set.</td>
    </tr>
    <tr>
      <td>setQuestionTimer</td>
      <td>Sets the timer of the question with the provided id to the provided timer.</td>
      <td><code>{ questionId: string, timer: number }</code> - The question ID and its timer.</td>
    </tr>
    <tr>
      <td>startQuiz</td>
      <td>Starts the timers for the quiz and current question. Also sets the quiz status to "started".</td>
      <td>None</td>
    </tr>
    <tr>
      <td>setQuizTimer</td>
      <td>Sets the timer of the quiz to the provided number.</td>
      <td><code>timer: number</code> - The quiz timer to set.</td>
    </tr>
    <tr>
      <td>answerQuestion</td>
      <td>Populates the answer with the `isCorrect` property and pushes it to userResponses. It replaces the answer if it is already in userResponses.</td>
      <td><code>{ questionId: string, selectedAnswer: string | string[] }</code> - Answer data.</td>
    </tr>
    <tr>
      <td>nextQuestion</td>
      <td>Stops all question timers, increments currentQuestionIndex by 1, and starts the timer for the new current question. Also increments maxVisibleQuestionIndex by 1 if it is equal to currentQuestionIndex.</td>
      <td>None</td>
    </tr>
    <tr>
      <td>prevQuestion</td>
      <td>Stops all question timers, decrements currentQuestionIndex by 1, and starts the timer for the new current question.</td>
      <td>None</td>
    </tr>
    <tr>
      <td>finishQuiz</td>
      <td>Sets the status of the quiz to "finished", stops all timers, and calculates the score.</td>
      <td>None</td>
    </tr>
    <tr>
      <td>calculatePoints</td>
      <td>Calculates the score based on the userResponses array and provided points for each question.</td>
      <td>None</td>
    </tr>
    <tr>
      <td>resetQuiz</td>
      <td>Resets the quiz state to the initial state. Everything is reset, including status, question indexes, score, timers and responses</td>
      <td>None</td>
    </tr>
  </tbody>
</table>

## Typescript References

```tsx
interface QuizData {
  //This is your quizData prop's (passed to QuizProvider) interface.
  //This data does not change during the quiz.
  title: string; // Title of the quiz
  description?: string; // Optional description
  questions: Question[]; // Array of questions
  timeLimit?: number; // Optional time limit for the entire quiz in seconds
}

interface Question {
  id: string; // ID of the question
  text: string; // The question text
  type: "multiple-choice" | "true-false" | "short-answer"; // Type of question
  options?: string[]; // Array of options (only for multiple-choice)
  correctAnswer: string | string[]; // Correct answer (string or array for multiple correct answers)
  explanation?: string; // Optional explanation for the correct answer
  incorrectMessage?: string; // Optional message for the incorrect answer
  timeLimit?: number; // Optional time limit for the question in seconds
  points?: number; //Optional points for the question
}

interface UserResponse {
  questionId: string; // ID of the question
  selectedAnswer: string | string[]; // Answer(s) chosen by the user
  isCorrect: boolean; // Whether the answer was correct, if correct answer was an array,
  // meaning it had multiple answers, all the values inside correctAnswer array have to have a matching value in selectedAnswer and vise versa for this to be true.
}

interface QuizState {
  //This is your whole state.
  //Use this state when using useQuiz hook and get want you want from it.
  quizData: QuizData; //quizData passed into QuizProvider
  status: "idle" | "started" | "finished"; //Status of the quiz
  currentQuestionIndex: number; //Index of the current question, starts from 1. This value can be used to implement custom logic like showing one question at a time. This value's change starts a timer for the new current question, if it has a timer, while stopping other timers.
  maxVisibleQuestionIndex: number; //Index of the maximum visible question, starts from 1, can be bigger than or equal to currentQuestionIndex. This value can be used to implement custom logic, for example to jump to last question if user went back in questions.
  userResponses: UserResponse[]; //userResponses array that gets populated with each answer
  score?: number; //optional total score, gets populated if at least 1 question has points, otherwise stays undefined
  timer?: number; //current timer of the quiz
  questionTimers: { questionId: string; timer: number }[]; //current timers of questions. Starts counting down from timer limits of each question if question is current.
}

interface SetQuestionTimerActionParam {
  //This is the interface of the param passed to setQuestionTimer
  questionId: string;
  timer: number;
}
```

## Error handling

Errors are thrown with descriptive messages when invalid operations are attempted (e.g., starting a quiz that's already started). You can see the thrown errors in your developer console. Most errors thrown by the app can be prevented by simple ui disabling, like disabling/removing the next button if question is the last question or disabling start button when quiz is already started.

```jsx
//example error handling
try {
  answerQuestion({ questionId: "q1" });
} catch (error) {
  console.error(error.message); // Please send in questionId and selectedAnswer
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your suggestions or fixes.

Steps to contribute:

1. Clone the repo
2. run `npm install` on root file and inside test-area
3. In test-area file, run `npm install ../` to link the root path as dependency to test-area
4. run `npm run server` in a terminal in root file
5. run `npm run start` in a terminal in root file

Changes you make inside the src file should be reflected inside dist file. You can then test the changes in http://localhost:5173/.

## Licence

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Additional Questions You Might Ask

**Can I use more than one QuizProvider?**\
Yes, Just make sure they are separate meaning providers are not nested inside one another. Then they will have their separate data (timers, state etc.).

**Are timers saved between refresh?**\
No, Every data is lost when refreshed/disconnected. You need to implement your own functionality if you wanna preserve data between sessions and use the setters to set them on library state.

**Can I customize the question types (e.g., adding new types of questions)?**\
No, Currently this library only supports ""multiple-choice", "true-false" and "short-answer" questions. If you would like to extend the library, feel free to contribute.

**How can I handle displaying correct/incorrect answers after the quiz is finished?**\
`state.userResponses` have the necessary info. You can take the info with useQuiz and use its isCorrect property for each question.

**Can I track the user's progress during the quiz?**\
You can use `currentQuestionIndex`, `maxVisibleQuestionIndex` values and `calculatePoints` action to track the progress and do what you want with it.

**Can I stop the timers?**\
No, currently you can not stop the quiz or question timers. But you can set them to new values with useAction hook's returned functions. I thought stopping the timers would defeat the point of having timers but I am open to suggestions on that.

**Does question timers reset when current question changes?**\
No, timers stay where they left off. So, for example, if you have 20 seconds left in a question and go to next question, then come back, the timer would start counting down from 20 seconds.
