import React from 'react'
import { motion } from 'framer-motion'

interface InputProps {
  type?: 'text' | 'email' | 'number'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onKeyPress?: (e: React.KeyboardEvent) => void
  className?: string
  autoFocus?: boolean
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyPress,
  className = '',
  autoFocus = true
}) => {
  return (
    <motion.input
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      autoFocus={autoFocus}
      className={`w-full px-0 py-4 text-lg bg-transparent border-0 border-b-2 border-gray-200 focus:border-black focus:outline-none transition-colors duration-200 ${className}`}
    />
  )
}
