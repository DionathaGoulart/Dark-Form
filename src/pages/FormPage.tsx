import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Question } from '../components/Question'
import { ProgressBar } from '../components/ProgressBar'
import { Button } from '../components/Button'
import type { Question as QuestionType, Answer, FormData } from '../types/form'
import { sendFormEmail, initEmailJS } from '../utils/email'

// Configuração das perguntas do formulário
const questions: QuestionType[] = [
  {
    id: 'name',
    question: 'Qual é o seu nome?',
    type: 'text',
    placeholder: 'Digite seu nome completo',
    required: true
  },
  {
    id: 'email',
    question: 'Qual é o seu e-mail?',
    type: 'email',
    placeholder: 'seuemail@exemplo.com',
    required: true
  },
  {
    id: 'age',
    question: 'Qual é a sua idade?',
    type: 'number',
    placeholder: 'Ex: 25',
    required: true
  },
  {
    id: 'interest',
    question: 'Qual é o seu principal interesse?',
    type: 'multiple',
    options: [
      'Tecnologia',
      'Design',
      'Marketing',
      'Vendas',
      'Educação',
      'Outro'
    ],
    required: true
  },
  {
    id: 'experience',
    question: 'Como você nos conheceu?',
    type: 'multiple',
    options: [
      'Google',
      'Redes sociais',
      'Indicação de amigos',
      'Website',
      'Publicidade',
      'Outro'
    ],
    required: true
  },
  {
    id: 'feedback',
    question: 'Tem algum comentário ou sugestão?',
    type: 'text',
    placeholder: 'Compartilhe seus pensamentos... (opcional)',
    required: false
  }
]

export const FormPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    // Inicializa o EmailJS quando o componente carrega
    initEmailJS()
  }, [])

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleAnswer = (value: string) => {
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: value
    }

    // Atualiza ou adiciona a resposta
    setAnswers((prev) => {
      const existingIndex = prev.findIndex(
        (a) => a.questionId === currentQuestion.id
      )
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newAnswer
        return updated
      }
      return [...prev, newAnswer]
    })
  }

  const handleNext = async () => {
    if (isLastQuestion) {
      // Submete o formulário
      setIsSubmitting(true)

      const formData: FormData = {
        answers,
        submittedAt: new Date()
      }

      try {
        const success = await sendFormEmail(formData)
        setSubmitSuccess(success)
        setIsCompleted(true)
      } catch (error) {
        console.error('Erro ao enviar formulário:', error)
        setSubmitSuccess(false)
        setIsCompleted(true)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
  }

  const restartForm = () => {
    setCurrentQuestionIndex(0)
    setAnswers([])
    setIsCompleted(false)
    setSubmitSuccess(false)
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full mx-auto"
          />
          <p className="text-lg text-gray-600">Enviando suas respostas...</p>
        </motion.div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {submitSuccess ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </motion.div>

          <h1 className="text-3xl font-light text-gray-900">
            {submitSuccess ? 'Obrigado!' : 'Ops! Algo deu errado'}
          </h1>

          <p className="text-gray-600">
            {submitSuccess
              ? 'Suas respostas foram enviadas com sucesso. Entraremos em contato em breve!'
              : 'Não foi possível enviar suas respostas. Tente novamente mais tarde.'}
          </p>

          <Button
            onClick={restartForm}
            variant={submitSuccess ? 'secondary' : 'primary'}
          >
            {submitSuccess ? 'Enviar outro formulário' : 'Tentar novamente'}
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar
        current={currentQuestionIndex + 1}
        total={questions.length}
      />

      <AnimatePresence mode="wait">
        <Question
          key={currentQuestion.id}
          data={currentQuestion}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={currentQuestionIndex > 0 ? handlePrevious : undefined}
          canGoBack={currentQuestionIndex > 0}
        />
      </AnimatePresence>
    </div>
  )
}
