import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ArrowLeft, RefreshCw } from 'lucide-react'

const UniqueGame = ({ onBack }) => {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentPuzzle, setCurrentPuzzle] = useState(null)
  const [level, setLevel] = useState(1)
  const [feedback, setFeedback] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const timerRef = useRef(null)

  const shapes = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon']
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316']

  const generatePuzzle = (difficulty) => {
    const numShapes = Math.min(8 + Math.floor(difficulty / 2), 20) // 8 to 20 shapes
    
    // Create shape-color combinations
    const combinations = []
    
    // Generate multiple instances of some combinations
    const numCombinations = Math.min(3 + Math.floor(difficulty / 3), 6)
    
    for (let i = 0; i < numCombinations; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const instances = Math.floor(Math.random() * 3) + 2 // 2-4 instances
      
      for (let j = 0; j < instances; j++) {
        combinations.push({ shape, color, isUnique: false })
      }
    }
    
    // Add one unique combination based on level difficulty
    let uniqueItemType = Math.random() < 0.5 ? 'shape' : 'color'

    let uniqueShape, uniqueColor
    let isUniqueShape = false
    let isUniqueColor = false

    if (uniqueItemType === 'shape') {
      // Ensure unique shape, color can be duplicated
      do {
        uniqueShape = shapes[Math.floor(Math.random() * shapes.length)]
      } while (combinations.filter(c => c.shape === uniqueShape).length > 0)
      // Ensure the unique shape's color is NOT unique among other shapes of different types
      do {
        uniqueColor = colors[Math.floor(Math.random() * colors.length)]
      } while (combinations.filter(c => c.color === uniqueColor).length === 0)
      isUniqueShape = true
    } else { // uniqueItemType === 'color'
      // Ensure unique color, shape can be duplicated
      do {
        uniqueColor = colors[Math.floor(Math.random() * colors.length)]
      } while (combinations.filter(c => c.color === uniqueColor).length > 0)
      // Ensure the unique color's shape is NOT unique among other shapes of different colors
      do {
        uniqueShape = shapes[Math.floor(Math.random() * shapes.length)]
      } while (combinations.filter(c => c.shape === uniqueShape).length === 0)
      isUniqueColor = true
    }

    combinations.push({ shape: uniqueShape, color: uniqueColor, isUnique: true, isUniqueShape, isUniqueColor })
    
    // Shuffle and trim to desired number
    const shuffled = combinations.sort(() => Math.random() - 0.5).slice(0, numShapes)
    
    // Ensure we have the unique one
    if (!shuffled.some(c => c.isUnique)) {
      shuffled[Math.floor(Math.random() * shuffled.length)] = { 
        shape: uniqueShape, 
        color: uniqueColor, 
        isUnique: true, 
        isUniqueShape, 
        isUniqueColor 
      }
    }
    
    // Add IDs and positions without overlap
    const grid = []
    const cellSize = 60 // Approximate size of each shape including padding
    const maxCols = Math.floor(400 / cellSize) // Max columns in 400px width
    const maxRows = Math.floor(300 / cellSize) // Max rows in 300px height
    const availablePositions = []

    for (let r = 0; r < maxRows; r++) {
      for (let c = 0; c < maxCols; c++) {
        availablePositions.push({
          x: c * cellSize + cellSize / 2 + 50, // Center of cell + offset
          y: r * cellSize + cellSize / 2 + 50  // Center of cell + offset
        })
      }
    }

    // Shuffle available positions
    availablePositions.sort(() => Math.random() - 0.5)

    for (let i = 0; i < shuffled.length; i++) {
      const position = availablePositions[i]
      grid.push({
        ...shuffled[i],
        id: i,
        x: position.x,
        y: position.y
      })
    }
    
    return {
      grid,
      numShapes,
      difficulty
    }
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setGameOver(false)
    setTimeLeft(60)
    setLevel(1)
    setCorrectAnswers(0)
    setFeedback('')
    setCurrentPuzzle(generatePuzzle(1))
    
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

  const selectItem = (itemId) => {
    if (!gameActive || !currentPuzzle || feedback) return

    const selectedItem = currentPuzzle.grid.find(item => item.id === itemId)
    
    // Determine if the selected item is the correct unique one based on the puzzle's unique type
    let isCorrect = selectedItem.isUniqueShape || selectedItem.isUniqueColor

    if (isCorrect) {
      const points = 10 + (level * 5)
      setScore(prev => prev + points)
      setCorrectAnswers(prev => prev + 1)
      setFeedback(`Correct! +${points} points`)
      
      // Level up every 3 correct answers
      if ((correctAnswers + 1) % 3 === 0) {
        setLevel(prev => prev + 1)
      }
      
      // Generate next puzzle after delay
      setTimeout(() => {
        setCurrentPuzzle(generatePuzzle(level))
        setFeedback('')
      }, 1000)
    } else {
      setFeedback('Wrong! Try again')
      setTimeout(() => {
        setFeedback('')
      }, 1000)
    }
  }

  const renderShape = (shape, color, size = 40) => {
    const shapeProps = {
      width: size,
      height: size,
      fill: color,
      stroke: '#333',
      strokeWidth: 2
    }

    switch (shape) {
      case 'circle':
        return <circle cx={size/2} cy={size/2} r={size/2 - 2} {...shapeProps} />
      case 'square':
        return <rect x={2} y={2} width={size-4} height={size-4} {...shapeProps} />
      case 'triangle':
        return <polygon points={`${size/2},2 2,${size-2} ${size-2},${size-2}`} {...shapeProps} />
      case 'diamond':
        return <polygon points={`${size/2},2 ${size-2},${size/2} ${size/2},${size-2} 2,${size/2}`} {...shapeProps} />
      case 'star':
        const points = []
        for (let i = 0; i < 5; i++) {
          const angle = (i * 144 - 90) * Math.PI / 180
          const outerX = size/2 + (size/2 - 4) * Math.cos(angle)
          const outerY = size/2 + (size/2 - 4) * Math.sin(angle)
          points.push(`${outerX},${outerY}`)
          
          const innerAngle = ((i + 0.5) * 144 - 90) * Math.PI / 180
          const innerX = size/2 + (size/4) * Math.cos(innerAngle)
          const innerY = size/2 + (size/4) * Math.sin(innerAngle)
          points.push(`${innerX},${innerY}`)
        }
        return <polygon points={points.join(' ')} {...shapeProps} />
      case 'hexagon':
        const hexPoints = []
        for (let i = 0; i < 6; i++) {
          const angle = (i * 60) * Math.PI / 180
          const x = size/2 + (size/2 - 4) * Math.cos(angle)
          const y = size/2 + (size/2 - 4) * Math.sin(angle)
          hexPoints.push(`${x},${y}`)
        }
        return <polygon points={hexPoints.join(' ')} {...shapeProps} />
      default:
        return <circle cx={size/2} cy={size/2} r={size/2 - 2} {...shapeProps} />
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPerformanceMessage = () => {
    if (correctAnswers >= 20) return "Outstanding! You have incredible pattern recognition skills!"
    if (correctAnswers >= 15) return "Excellent! Your eye for detail is impressive!"
    if (correctAnswers >= 10) return "Great job! You're getting good at spotting differences!"
    if (correctAnswers >= 5) return "Not bad! Keep practicing to sharpen your observation skills!"
    return "Good effort! Pattern recognition takes practice!"
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
            <h1 className="text-4xl font-bold text-gray-800">Unique Challenge</h1>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Game Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl font-bold text-blue-600">{score}</div>
              <p className="text-lg">{getPerformanceMessage()}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold">Correct Answers</div>
                  <div className="text-2xl">{correctAnswers}</div>
                </div>
                <div>
                  <div className="font-semibold">Level Reached</div>
                  <div className="text-2xl">{level}</div>
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
          <h1 className="text-4xl font-bold text-gray-800">Unique Challenge</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Game Stats</CardTitle>
              <CardDescription>
                Find the shape that is unique in either its shape OR its color, but not both!
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
                  <span>Level:</span>
                  <span className="font-bold text-xl">{level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Correct:</span>
                  <span className="font-bold text-xl text-blue-600">{correctAnswers}</span>
                </div>
                
                {/* Level Progress */}
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Next Level Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((correctAnswers % 3) / 3) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {3 - (correctAnswers % 3)} more correct for level {level + 1}
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
            {gameActive && currentPuzzle && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-center">Find the unique shape or color!</CardTitle>
                  <CardDescription className="text-center">
                    Level {level} - Click on the shape that has a unique shape OR unique color (not both)
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-6">
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

                  {/* Game Area - Scattered Shapes */}
                  <div 
                    className="relative w-full h-96 bg-white rounded-lg shadow-lg border-2 border-gray-200"
                    style={{ maxWidth: '500px' }}
                  >
                    {currentPuzzle.grid.map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute p-1 rounded-lg hover:bg-blue-50 transition-colors"
                        style={{
                          left: `${item.x}px`,
                          top: `${item.y}px`,
                          transform: `translate(-50%, -50%)`
                        }}
                        animate={item.isSpinning ? { rotate: 360 } : { rotate: 0 }}
                        transition={item.isSpinning ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                        onClick={() => selectItem(item.id)}
                        disabled={!!feedback}
                      >
                        <svg width="40" height="40">
                          {renderShape(item.shape, item.color, 40)}
                        </svg>
                      </motion.button>
                    ))}
                  </div>

                  <div className="text-sm text-gray-600 text-center max-w-md">
                    Find the shape that is unique in either its shape OR its color! 
                    Look for the one shape that has no duplicates in either attribute.
                  </div>
                </CardContent>
              </Card>
            )}

            {!gameActive && !gameOver && (
              <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center min-h-96 space-y-6">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Unique Challenge</h2>
                    <p className="text-lg text-gray-600 max-w-md">
                      Test your visual attention skills! Find the one shape that is unique 
                      in either its shape OR its color (but not both). Look for shapes that 
                      have no duplicates in one of these attributes.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>How to play:</strong> Look for the shape that is unique in either 
                        its shape OR its color. For example, if there are multiple circles but only 
                        one is red, or multiple red shapes but only one is a triangle - that's your target!
                      </p>
                      <p className="text-sm text-blue-800 mt-2">
                        The game ensures only one shape will be unique in either shape or color, 
                        making each puzzle have exactly one correct answer.
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

export default UniqueGame

