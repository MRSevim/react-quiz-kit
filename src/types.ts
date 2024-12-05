interface Quiz {
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
}

interface UserResponse {
  questionId: string; // ID of the question
  selectedAnswer: string | string[]; // Answer(s) chosen by the user
  isCorrect: boolean; // Whether the answer was correct
}

interface QuizContextState {
  quiz: Quiz;
  currentQuestionIndex: number;
  userResponses: UserResponse[];
  score: number;
  updateAnswer: (questionId: string, answer: string | string[]) => void;
}
