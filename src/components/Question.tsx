import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Question as QuestionType } from '../types/form'
import { Input } from './Input'
import { Button } from './Button'

interface QuestionProps {
  data: QuestionType
  onAnswer: (value: string) => void
  onNext: () => void
  onPrevious?: () => void
  canGoBack?: boolean
}

export const Question: React.FC<QuestionProps> = ({
  data,
  onAnswer,
  onNext,
  onPrevious,
  canGoBack = false
}) => {
  const [answer, setAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

  useEffect(() => {
    setAnswer('')
    setSelectedOption('')
  }, [data.id])

  const handleAnswer = (value: string) => {
    if (data.type === 'multiple') {
      setSelectedOption(value)
      onAnswer(value)
    } else {
      setAnswer(value)
      onAnswer(value)
    }
  }

  const handleSubmit = () => {
    const finalAnswer = data.type === 'multiple' ? selectedOption : answer
    if (finalAnswer.trim()) {
      onNext()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const isValid = data.type === 'multiple' ? selectedOption : answer.trim()

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col justify-center px-8 max-w-2xl mx-auto"
    >
      <div className="space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-light text-gray-900 leading-tight"
        >
          {data.question}
        </motion.h1>

        <AnimatePresence mode="wait">
          {data.type === 'multiple' ? (
            <motion.div
              key="multiple"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {data.options?.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 hover:border-black ${
                    selectedOption === option
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{option}</span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Input
                type={
                  data.type === 'email'
                    ? 'email'
                    : data.type === 'number'
                    ? 'number'
                    : 'text'
                }
                placeholder={data.placeholder || 'Digite sua resposta...'}
                value={answer}
                onChange={handleAnswer}
                onKeyPress={handleKeyPress}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-between items-center pt-8"
        >
          {canGoBack && onPrevious ? (
            <Button variant="secondary" onClick={onPrevious}>
              Voltar
            </Button>
          ) : (
            <div />
          )}

          <Button onClick={handleSubmit} disabled={!isValid}>
            Continuar
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 left-4 text-sm text-gray-400"
      >
        Pressione{' '}
        <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Enter</kbd> para
        continuar
      </motion.div>
    </motion.div>
  )
}
