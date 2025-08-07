import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import coffeeGif from '../assets/coffee_steaming.gif'

const LoadingScreen = ({ onLoadingComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showContent, setShowContent] = useState(false)

  const phases = [
    "Brewing your perfect break...",
    "Grinding fresh ideas...",
    "Steaming up some fun...",
    "Almost ready to take a break!"
  ]

  useEffect(() => {
    // Phase progression
    const phaseTimer = setInterval(() => {
      setCurrentPhase(prev => {
        if (prev < phases.length - 1) {
          return prev + 1
        } else {
          clearInterval(phaseTimer)
          // Start content reveal after a short delay
          setTimeout(() => {
            setShowContent(true)
            setTimeout(() => {
              onLoadingComplete()
            }, 700) // was 1000, now 500ms
          }, 700) // was 1000, now 500ms
          return prev
        }
      })
    }, 800) // was 1200, now 600ms

    return () => clearInterval(phaseTimer)
  }, [onLoadingComplete])

  return (
    <AnimatePresence>
      {!showContent && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
        >
          <div className="text-center space-y-8">
            {/* Animated Coffee GIF */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                y: [0, -10, 0]
              }}
              transition={{ 
                scale: { duration: 0.8, ease: "easeOut" },
                rotate: { duration: 0.8, ease: "easeOut" },
                y: { 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }
              }}
              className="flex justify-center"
            >
              <img 
                src={coffeeGif} 
                alt="Steaming Coffee" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-lg"
              />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-amber-800 mb-4"
            >
              Take a Break
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg md:text-xl text-amber-700 mb-8"
            >
              You deserve this moment of pause
            </motion.p>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="space-y-4"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-amber-600 text-lg font-medium"
                >
                  {phases[currentPhase]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 1.5, duration: 2 }} // was duration: 3
              className="max-w-xs mx-auto"
            >
              <div className="w-full bg-amber-200 rounded-full h-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }} // was duration: 3
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen

