'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AudioWave() {
  // Generate random heights for wave bars
  const generateRandomHeights = () => {
    return Array.from({ length: 20 }, () => Math.random() * 80 + 20)
  }

  const [heights, setHeights] = useState(generateRandomHeights)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(generateRandomHeights())
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <div className="max-w-md w-full">
        {/* Wave Visualization */}
        <div className="flex items-end justify-center gap-1 h-32 mb-6 bg-white rounded-lg p-4">
          {heights.map((height, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-t from-gray-800 to-black rounded-sm"
              style={{
                width: '8px',
              }}
              animate={{
                height: true ? `${height}%` : '20%',
              }}
              transition={{
                duration: 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
