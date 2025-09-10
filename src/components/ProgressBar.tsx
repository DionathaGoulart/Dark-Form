import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="fixed top-0 left-0 w-full z-10">
      <div className="w-full bg-gray-200 h-1">
        <motion.div
          className="h-1 bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="absolute top-4 left-4 text-sm text-gray-500">
        {current} de {total}
      </div>
    </div>
  )
}
