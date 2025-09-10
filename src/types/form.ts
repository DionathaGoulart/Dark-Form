export type QuestionType = 'text' | 'email' | 'number' | 'multiple'

export interface Question {
  id: string
  question: string
  type: QuestionType
  options?: string[]
  required?: boolean
  placeholder?: string
}

export interface Answer {
  questionId: string
  question: string
  answer: string
}

export interface FormData {
  answers: Answer[]
  submittedAt: Date
}
