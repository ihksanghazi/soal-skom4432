export interface Question {
  id: number
  question: string
  options: string[]
  answer: number
}

export interface QuizData {
  title: string
  description: string
  questions: Question[]
}