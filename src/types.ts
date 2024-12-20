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
  //meaning it had multiple answers, all the values inside correctAnswer array have to have a matching value in selectedAnswer and vise versa for this to be true.
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
