interface QuizData {
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
  timeLimit?: number; // Optional time limit for the question in seconds
  points?: number; //Optional points for the question
}

interface UserResponse {
  questionId: string; // ID of the question
  selectedAnswer: string | string[]; // Answer(s) chosen by the user
  isCorrect: boolean; // Whether the answer was correct
}

interface QuizState {
  quizData: QuizData; //quizData passed into QuizProvider
  status: "idle" | "started" | "finished"; //Status of the quiz
  currentQuestionIndex: number; //Index of the current question, starts from 1
  maxVisibleQuestionIndex: number; //Index of the maximum visible question, starts from 1
  userResponses: UserResponse[]; //userResponses array that gets populated with each answer
  score?: number; //optional total score, gets populated if at least 1 question has points, otherwise stays undefined
  timer?: number; //current timer of the quiz
  questionTimers: { questionId: string; timer: number }[]; //current timers of questions
}

interface SetQuestionTimerActionParam {
  questionId: string;
  timer: number;
}
