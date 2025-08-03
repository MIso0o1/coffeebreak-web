import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ArrowLeft, RefreshCw } from 'lucide-react'

const TrueColorGame = ({ onBack }) => {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentCard, setCurrentCard] = useState(null)
  const [streak, setStreak] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [feedback, setFeedback] = useState('')
  const timerRef = useRef(null)

  const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE']
  const colorMap = {
    'RED': '#ef4444',
    'BLUE': '#3b82f6', 
    'GREEN': '#22c55e',
    'YELLOW': '#eab308',
    'PURPLE': '#a855f7',
    'ORANGE': '#f97316'
  }

  const generateCard = () => {
    const meaningWord = colors[Math.floor(Math.random() * colors.length)]
    const inkColor = colors[Math.floor(Math.random() * colors.length)]
    const displayWord = colors[Math.floor(Math.random() * colors.length)]
    
    return {
      meaningWord,
      inkColor,
      displayWord,
      isMatch: meaningWord === inkColor
    }
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setGameOver(false)
    setTimeLeft(60)
    setStreak(0)
    setMultiplier(1)
    setFeedback('')
    setCurrentCard(generateCard())
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false)
          setGameOver(true)
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const makeChoice = (playerChoice) => {
    if (!gameActive || !currentCard) return

    const isCorrect = (playerChoice === 'YES' && currentCard.isMatch) || 
                     (playerChoice === 'NO' && !currentCard.isMatch)

    if (isCorrect) {
      const newStreak = streak + 1
      setStreak(newStreak)
      
      // Update multiplier based on streak
      const newMultiplier = Math.min(Math.floor(newStreak / 3) + 1, 5)
      setMultiplier(newMultiplier)
      
      const points = 10 * newMultiplier
      setScore(prev => prev + points)
      setFeedback(`Correct! +${points} points`)
    } else {
      setStreak(0)
      setMultiplier(1)
      setFeedback('Wrong! Streak reset')
    }

    // Generate next card after a brief delay
    setTimeout(() => {
      setCurrentCard(generateCard())
      setFeedback('')
    }, 800)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPerformanceMessage = () => {
    if (score >= 1000) return "Incredible! You've mastered the Stroop effect!"
    if (score >= 700) return "Excellent focus! Your brain is sharp as a tack!"
    if (score >= 500) return "Great job! You're getting good at ignoring distractions!"
    if (score >= 300) return "Not bad! Keep practicing to improve your mental agility!"
    return "Good effort! The Stroop effect is tricky for everyone!"
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  if (gameOver) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-4xl font-bold text-gray-800">True Color Challenge</h1>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Game Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl font-bold text-purple-600">{score}</div>
              <p className="text-lg">{getPerformanceMessage()}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold">Best Streak</div>
                  <div className="text-2xl">{streak}</div>
                </div>
                <div>
                  <div className="font-semibold">Max Multiplier</div>
                  <div className="text-2xl">{multiplier}x</div>
                </div>
              </div>
              <div className="space-x-4">
                <Button onClick={startGame}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button variant="outline" onClick={onBack}>Back to Games</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">True Color Challenge</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Game Stats</CardTitle>
              <CardDescription>
                Does the meaning match the ink color?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold text-2xl">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-bold text-2xl">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Streak:</span>
                  <span className="font-bold text-xl">{streak}</span>
                </div>
                <div className="flex justify-between">
                  <span>Multiplier:</span>
                  <span className="font-bold text-xl text-purple-600">{multiplier}x</span>
                </div>
                
                {/* Multiplier Progress */}
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Next Multiplier Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((streak % 3) / 3) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {3 - (streak % 3)} more correct for {multiplier + 1}x
                  </div>
                </div>

                {!gameActive && !gameOver && (
                  <Button onClick={startGame} className="w-full">
                    Start Challenge!
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Game Area */}
          <div className="lg:col-span-2">
            {gameActive && currentCard && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-center">Does the meaning match the ink color?</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-8 min-h-96">
                  {/* Meaning Card */}
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">MEANING</div>
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg w-64 h-32 flex items-center justify-center">
                      <div className="text-4xl font-bold text-black">
                        {currentCard.meaningWord}
                      </div>
                    </div>
                  </div>

                  {/* Ink Color Card */}
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">INK COLOR</div>
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg w-64 h-32 flex items-center justify-center">
                      <div 
                        className="text-4xl font-bold"
                        style={{ color: colorMap[currentCard.inkColor] }}
                      >
                        {currentCard.displayWord}
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  <AnimatePresence>
                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`text-lg font-semibold ${
                          feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {feedback}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Choice Buttons */}
                  <div className="flex gap-4">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="px-8 py-4 text-xl"
                      onClick={() => makeChoice('YES')}
                      disabled={!!feedback}
                    >
                      YES
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline" 
                      className="px-8 py-4 text-xl"
                      onClick={() => makeChoice('NO')}
                      disabled={!!feedback}
                    >
                      NO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!gameActive && !gameOver && (
              <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center min-h-96 space-y-6">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">True Color Challenge</h2>
                    <p className="text-lg text-gray-600 max-w-md">
                      Test your mental agility with the Stroop effect! Compare the meaning of the top word 
                      with the ink color of the bottom word. Can you ignore the distracting text?
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>How to play:</strong> Look at the meaning of the word on top, 
                        then check if it matches the ink color (not the text) of the word below.
                      </p>
                    </div>
                  </div>
                  <Button onClick={startGame} size="lg">
                    Start Challenge!
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TrueColorGame

