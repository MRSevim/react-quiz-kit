interface QuizData {
  title: string; // Title of the quiz
  description?: string; // Optional description
  questions: Question[]; // Array of questions
  timeLimit?: number; // Optional time limit for the entire quiz in seconds
}

interface Question {
  id: string; // Unique identifier for the question
  text: string; // The question text
  type: "multiple-choice" | "true-false" | "short-answer"; // Type of question
  options?: string[]; // Array of options (only for multiple-choice)
  correctAnswer: string | string[]; // Correct answer (string or array for multiple answers)
  explanation?: string; // Optional explanation for the correct answer
  timeLimit?: number; // Optional time limit for this question in seconds
  points?: number;
}

interface UserResponse {
  questionId: string; // ID of the question
  selectedAnswer: string | string[]; // Answer(s) chosen by the user
  isCorrect: boolean; // Whether the answer was correct
}

interface QuizState {
  quizData?: QuizData;
  status?: "idle" | "started" | "finished";
  currentQuestionIndex?: number; //starts from 1
  maxVisibleQuestionIndex?: number;
  userResponses?: UserResponse[];
  score?: number;
  timer?: number;
  questionTimers?: { questionId: string; timer: number }[];
}
