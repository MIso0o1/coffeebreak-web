import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Coffee, Clock, Target, ArrowLeft, Home, Lightbulb, RefreshCw, Zap } from 'lucide-react'
import heroImage from './assets/hero_image.png'
import dailyGrindIcon from './assets/daily_grind_icon.png'
import procrastinationIcon from './assets/procrastination_station_icon.png'
import mugShotIcon from './assets/mug_shot_icon.png'
import reactionTimeIcon from './assets/reaction_time_icon.png'
import uselessFactsIcon from './assets/useless_facts_icon.png'
import chaosPageIcon from './assets/chaos_page_icon.png'
import dailyGrindBg from './assets/daily_grind_game_background.png'
import { getRandomFact, getAllCategories, getFactsByCategory } from './data/uselessFacts.js'
import { chaosContent, getRandomChaosElement, getRandomChaosMessage, getRandomChaosWord } from './data/chaosContent.js'
import CookieConsent from './components/CookieConsent.jsx'
import './App.css'

// Game Components
const DailyGrindGame = ({ onBack }) => {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [distractions, setDistractions] = useState([])

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setTimeLeft(30)
    setDistractions([])
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Spawn distractions
    const distractionTimer = setInterval(() => {
      if (Math.random() < 0.3) {
        const newDistraction = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          type: ['email', 'meeting', 'notification'][Math.floor(Math.random() * 3)]
        }
        setDistractions(prev => [...prev, newDistraction])
        
        setTimeout(() => {
          setDistractions(prev => prev.filter(d => d.id !== newDistraction.id))
        }, 2000)
      }
    }, 1000)

    setTimeout(() => {
      clearInterval(distractionTimer)
    }, 30000)
  }

  const grindCoffee = () => {
    if (gameActive) {
      setScore(prev => prev + 1)
    }
  }

  const hitDistraction = (id) => {
    setDistractions(prev => prev.filter(d => d.id !== id))
    setScore(prev => Math.max(0, prev - 2))
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">The Daily Grind</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Game Stats</CardTitle>
              <CardDescription>
                Click the coffee area to grind beans! Avoid the distractions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold text-2xl">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Left:</span>
                  <span className="font-bold text-2xl">{timeLeft}s</span>
                </div>
                {!gameActive && timeLeft === 30 && (
                  <Button onClick={startGame} className="w-full">
                    Start Grinding!
                  </Button>
                )}
                {!gameActive && timeLeft === 0 && (
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2">Game Over!</p>
                    <p className="text-gray-600 mb-4">
                      {score > 50 ? "Excellent grinding! You're a coffee master!" :
                       score > 25 ? "Good job! You managed to stay focused." :
                       "Don't worry, even the best baristas get distracted sometimes."}
                    </p>
                    <Button onClick={startGame}>Play Again</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="relative">
            <div 
              className="relative w-full h-96 bg-cover bg-center rounded-lg overflow-hidden cursor-pointer border-4 border-amber-200"
              style={{ backgroundImage: `url(${dailyGrindBg})` }}
              onClick={grindCoffee}
            >
              {gameActive && (
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-white text-xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded"
                  >
                    Click to Grind!
                  </motion.div>
                </div>
              )}
              
              <AnimatePresence>
                {distractions.map(distraction => (
                  <motion.div
                    key={distraction.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute cursor-pointer"
                    style={{ 
                      left: `${distraction.x}%`, 
                      top: `${distraction.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      hitDistraction(distraction.id)
                    }}
                  >
                    <div className="bg-red-500 text-white p-2 rounded-full text-xs font-bold animate-bounce">
                      {distraction.type === 'email' ? '📧' : 
                       distraction.type === 'meeting' ? '📅' : '🔔'}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const ProcrastinationStation = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const scenarios = [
    {
      situation: "You have a deadline in 2 hours, but you just discovered a fascinating Wikipedia article about the history of paperclips.",
      choices: [
        { text: "Read the entire article and follow 5 more links", points: 3, result: "Classic procrastination! You now know everything about paperclips but nothing about your deadline." },
        { text: "Bookmark it for later and get back to work", points: 1, result: "Responsible choice, but let's be honest - you'll never read that bookmark." },
        { text: "Compromise: read just the introduction", points: 2, result: "The introduction leads to the invention section, which leads to... 3 hours later." }
      ]
    },
    {
      situation: "Your coffee break was supposed to end 20 minutes ago, but you're in the middle of an intense online debate about whether a hot dog is a sandwich.",
      choices: [
        { text: "Continue the debate - this is important!", points: 3, result: "You've convinced three strangers that hot dogs are tacos. Your boss is not impressed." },
        { text: "Reluctantly return to work", points: 1, result: "You go back to work but keep checking your phone for debate updates." },
        { text: "Post one final 'mic drop' comment", points: 2, result: "Your 'final' comment sparks 47 more replies. The debate continues without you." }
      ]
    },
    {
      situation: "You opened your laptop to work on a presentation, but somehow ended up watching a 40-minute video about how bubble wrap is made.",
      choices: [
        { text: "Watch the entire series about packaging materials", points: 3, result: "You're now an expert on industrial packaging but your presentation is still blank." },
        { text: "Close the video and start working immediately", points: 1, result: "You start working but keep thinking about those satisfying bubble wrap pops." },
        { text: "Watch just one more video about cardboard", points: 2, result: "One video becomes five. You now understand the entire supply chain of Amazon boxes." }
      ]
    }
  ]

  const makeChoice = (choiceIndex) => {
    const choice = scenarios[currentScenario].choices[choiceIndex]
    setScore(prev => prev + choice.points)
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => setCurrentScenario(prev => prev + 1), 2000)
    } else {
      setTimeout(() => setGameOver(true), 2000)
    }
  }

  const resetGame = () => {
    setCurrentScenario(0)
    setScore(0)
    setGameOver(false)
  }

  if (gameOver) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-4xl font-bold text-gray-800">Procrastination Station</h1>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Procrastination Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl font-bold text-purple-600">{score}/9</div>
              <p className="text-lg">
                {score >= 8 ? "Master Procrastinator! You've turned avoiding work into an art form." :
                 score >= 6 ? "Solid Procrastination Skills! You know how to waste time effectively." :
                 score >= 4 ? "Amateur Procrastinator. You still have some productivity left in you." :
                 "Productivity Alert! You're dangerously close to being responsible."}
              </p>
              <div className="space-x-4">
                <Button onClick={resetGame}>Procrastinate Again</Button>
                <Button variant="outline" onClick={onBack}>Back to Reality</Button>
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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">Procrastination Station</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Scenario {currentScenario + 1} of {scenarios.length}</CardTitle>
            <CardDescription>Score: {score}/9</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">{scenarios[currentScenario].situation}</p>
              
              <div className="space-y-3">
                {scenarios[currentScenario].choices.map((choice, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => makeChoice(index)}
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

const MugShotGame = ({ onBack }) => {
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [mugs, setMugs] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 1 minute in seconds
  const [totalMugsShot, setTotalMugsShot] = useState(0)
  const timerRef = useRef(null)

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setGameOver(false)
    setTimeLeft(60)
    setTotalMugsShot(0)
    spawnMugs()
    
    // Start the countdown timer
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

  const spawnMugs = () => {
    const newMugs = []
    for (let i = 0; i < 5; i++) {
      newMugs.push({
        id: Math.random(),
        x: Math.random() * 70 + 15,
        y: Math.random() * 50 + 25,
        size: Math.random() * 30 + 40,
        points: Math.floor(Math.random() * 3) + 1
      })
    }
    setMugs(newMugs)
  }

  const shootMug = (mugId, points) => {
    if (gameActive) {
      setScore(prev => prev + points)
      setTotalMugsShot(prev => prev + 1)
      setMugs(prev => prev.filter(mug => mug.id !== mugId))
      
      // Spawn new mugs when all are shot
      if (mugs.length === 1) {
        setTimeout(spawnMugs, 500) // Small delay for better UX
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPerformanceMessage = () => {
    const mugsPerMinute = (totalMugsShot / 1).toFixed(1)
    if (totalMugsShot >= 50) return `Outstanding! ${totalMugsShot} mugs shot! You're a coffee sniper with ${mugsPerMinute} mugs/min!`
    if (totalMugsShot >= 30) return `Excellent shooting! ${totalMugsShot} mugs hit at ${mugsPerMinute} mugs/min. Barista level achieved!`
    if (totalMugsShot >= 20) return `Good aim! ${totalMugsShot} mugs down. You're getting the hang of this coffee shooting!`
    if (totalMugsShot >= 10) return `Not bad! ${totalMugsShot} mugs hit. Keep practicing your coffee marksmanship!`
    return `${totalMugsShot} mugs hit. Even coffee masters started somewhere. Try again!`
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">Mug Shot Challenge</h1>
          <Clock className="w-8 h-8 text-teal-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>1-Minute Challenge</CardTitle>
              <CardDescription>
                How many mugs can you shoot in 1 minute? Smaller mugs = more points!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold text-2xl text-teal-600">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mugs Shot:</span>
                  <span className="font-bold text-2xl text-green-600">{totalMugsShot}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Left:</span>
                  <span className={`font-bold text-2xl ${timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                
                {/* Progress bar for time */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      timeLeft > 40 ? 'bg-green-500' : 
                      timeLeft > 20 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                  ></div>
                </div>

                {!gameActive && !gameOver && (
                  <Button onClick={startGame} className="w-full bg-teal-600 hover:bg-teal-700">
                    <Target className="w-4 h-4 mr-2" />
                    Start 1-Minute Challenge!
                  </Button>
                )}
                
                {gameOver && (
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2 text-teal-700">Time's Up!</p>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {getPerformanceMessage()}
                    </p>
                    <div className="bg-teal-50 p-3 rounded-lg mb-4">
                      <div className="text-sm text-teal-700">
                        <div>Final Score: <span className="font-bold">{score}</span></div>
                        <div>Total Mugs: <span className="font-bold">{totalMugsShot}</span></div>
                        <div>Rate: <span className="font-bold">{(totalMugsShot / 1).toFixed(1)} mugs/min</span></div>
                      </div>
                    </div>
                    <Button onClick={startGame} className="bg-teal-600 hover:bg-teal-700">
                      <Target className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <div 
              className="relative w-full h-96 bg-gradient-to-b from-sky-200 to-green-200 rounded-lg overflow-hidden cursor-crosshair border-4 border-teal-200"
            >
              {!gameActive && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-600 text-xl font-bold bg-white bg-opacity-90 px-6 py-4 rounded-lg shadow-lg text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-teal-600" />
                    <div>Ready for the 1-minute challenge?</div>
                    <div className="text-sm text-gray-500 mt-1">Click "Start 1-Minute Challenge!" to begin</div>
                  </div>
                </div>
              )}
              
              {gameActive && (
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg">
                  <div className="text-sm font-semibold text-gray-700">
                    {formatTime(timeLeft)} | Score: {score} | Mugs: {totalMugsShot}
                  </div>
                </div>
              )}
              
              <AnimatePresence>
                {mugs.map(mug => (
                  <motion.div
                    key={mug.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0, rotate: 360 }}
                    className="absolute cursor-pointer"
                    style={{ 
                      left: `${mug.x}%`, 
                      top: `${mug.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      shootMug(mug.id, mug.points)
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div 
                      className="bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold border-2 border-amber-800 hover:bg-amber-700 transition-colors shadow-lg"
                      style={{ 
                        width: `${mug.size}px`, 
                        height: `${mug.size * 0.8}px` 
                      }}
                    >
                      ☕
                    </div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-xs px-1 rounded">
                      +{mug.points}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Reaction Time Game Component
const ReactionTimeGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('waiting') // 'waiting', 'ready', 'go', 'clicked', 'too-early'
  const [reactionTime, setReactionTime] = useState(null)
  const [bestTime, setBestTime] = useState(localStorage.getItem('bestReactionTime') || null)
  const [attempts, setAttempts] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

  const startGame = () => {
    setGameState('ready')
    setReactionTime(null)
    
    // Random delay between 1-5 seconds
    const delay = Math.random() * 4000 + 1000
    const id = setTimeout(() => {
      setStartTime(Date.now())
      setGameState('go')
    }, delay)
    setTimeoutId(id)
  }

  const handleClick = () => {
    if (gameState === 'ready') {
      // Clicked too early
      setGameState('too-early')
      clearTimeout(timeoutId)
    } else if (gameState === 'go') {
      // Good reaction
      const endTime = Date.now()
      const reaction = endTime - startTime
      setReactionTime(reaction)
      setGameState('clicked')
      
      // Update attempts
      const newAttempts = [...attempts, reaction].slice(-5) // Keep last 5 attempts
      setAttempts(newAttempts)
      
      // Update best time
      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction)
        localStorage.setItem('bestReactionTime', reaction.toString())
      }
    }
  }

  const resetGame = () => {
    setGameState('waiting')
    clearTimeout(timeoutId)
  }

  const getReactionMessage = (time) => {
    if (time < 200) return "Lightning fast! Are you even human?"
    if (time < 250) return "Excellent reflexes! You're in the top 10%!"
    if (time < 300) return "Great reaction time! Well above average."
    if (time < 400) return "Good reflexes! Right around average."
    if (time < 500) return "Not bad! Room for improvement though."
    return "Might want to cut back on the coffee... or drink more?"
  }

  const averageTime = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : null

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">Reaction Time Test</h1>
          <Zap className="w-8 h-8 text-yellow-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
              <CardDescription>
                Test your reflexes! Click as soon as the screen turns green.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reactionTime && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">{reactionTime}ms</div>
                    <div className="text-sm text-green-700">{getReactionMessage(reactionTime)}</div>
                  </div>
                )}
                
                {bestTime && (
                  <div className="flex justify-between">
                    <span>Best Time:</span>
                    <span className="font-bold text-yellow-600">{bestTime}ms</span>
                  </div>
                )}
                
                {averageTime && (
                  <div className="flex justify-between">
                    <span>Average (last 5):</span>
                    <span className="font-bold text-blue-600">{averageTime}ms</span>
                  </div>
                )}

                {attempts.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Recent attempts:</div>
                    <div className="flex flex-wrap gap-2">
                      {attempts.map((time, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {time}ms
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-4">
                  <div>• Average human reaction time: 200-300ms</div>
                  <div>• Professional gamers: 150-200ms</div>
                  <div>• Don't click too early or you'll have to restart!</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="relative">
            <div 
              className={`relative w-full h-96 rounded-lg overflow-hidden cursor-pointer border-4 transition-all duration-300 flex items-center justify-center ${
                gameState === 'waiting' ? 'bg-gray-200 border-gray-300' :
                gameState === 'ready' ? 'bg-red-500 border-red-600' :
                gameState === 'go' ? 'bg-green-500 border-green-600' :
                gameState === 'clicked' ? 'bg-blue-500 border-blue-600' :
                gameState === 'too-early' ? 'bg-orange-500 border-orange-600' : 'bg-gray-200 border-gray-300'
              }`}
              onClick={handleClick}
            >
              {gameState === 'waiting' && (
                <div className="text-center">
                  <div className="text-gray-600 text-2xl font-bold mb-4">Ready to test your reflexes?</div>
                  <Button onClick={startGame} size="lg" className="bg-yellow-600 hover:bg-yellow-700">
                    Start Test
                  </Button>
                </div>
              )}
              
              {gameState === 'ready' && (
                <div className="text-center">
                  <div className="text-white text-3xl font-bold mb-2">Wait for GREEN</div>
                  <div className="text-red-100 text-lg">Don't click yet!</div>
                </div>
              )}
              
              {gameState === 'go' && (
                <div className="text-center">
                  <div className="text-white text-4xl font-bold animate-pulse">CLICK NOW!</div>
                </div>
              )}
              
              {gameState === 'clicked' && (
                <div className="text-center">
                  <div className="text-white text-3xl font-bold mb-4">{reactionTime}ms</div>
                  <div className="text-blue-100 text-lg mb-4">{getReactionMessage(reactionTime)}</div>
                  <Button onClick={startGame} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    Try Again
                  </Button>
                </div>
              )}
              
              {gameState === 'too-early' && (
                <div className="text-center">
                  <div className="text-white text-3xl font-bold mb-2">Too Early!</div>
                  <div className="text-orange-100 text-lg mb-4">Wait for the green screen next time</div>
                  <Button onClick={startGame} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Useless Facts Component
const UselessFacts = ({ onBack }) => {
  const [currentFact, setCurrentFact] = useState(getRandomFact())
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isAnimating, setIsAnimating] = useState(false)
  
  const categories = ['All', ...getAllCategories()]

  const getNewFact = () => {
    setIsAnimating(true)
    setTimeout(() => {
      if (selectedCategory === 'All') {
        setCurrentFact(getRandomFact())
      } else {
        const categoryFacts = getFactsByCategory(selectedCategory)
        const randomIndex = Math.floor(Math.random() * categoryFacts.length)
        setCurrentFact(categoryFacts[randomIndex])
      }
      setIsAnimating(false)
    }, 300)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setIsAnimating(true)
    setTimeout(() => {
      if (category === 'All') {
        setCurrentFact(getRandomFact())
      } else {
        const categoryFacts = getFactsByCategory(category)
        const randomIndex = Math.floor(Math.random() * categoryFacts.length)
        setCurrentFact(categoryFacts[randomIndex])
      }
      setIsAnimating(false)
    }, 300)
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
          <h1 className="text-4xl font-bold text-gray-800">Useless Facts</h1>
          <Lightbulb className="w-8 h-8 text-yellow-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Choose a category or get random facts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fact Display */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Did You Know?</CardTitle>
                  <Button 
                    onClick={getNewFact}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={isAnimating}
                  >
                    <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
                    New Fact
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Badge variant="secondary" className="mb-4">
                      {currentFact.category}
                    </Badge>
                    <p className="text-lg leading-relaxed text-gray-700">
                      {currentFact.fact}
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 italic">
                    "The best way to waste time is to learn something completely useless with complete confidence."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Coffee Break Philosophy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fun Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">40+</div>
              <div className="text-sm text-gray-600">Useless Facts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">10</div>
              <div className="text-sm text-gray-600">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-600">Time Wasted</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

// Chaos Page Component
const ChaosPage = ({ onBack }) => {
  const [chaosLevel, setChaosLevel] = useState(0)
  const [isScrollReversed, setIsScrollReversed] = useState(false)
  const [flyingElements, setFlyingElements] = useState([])
  const [chaosMessage, setChaosMessage] = useState('')
  const [buttonsRunning, setButtonsRunning] = useState(false)
  const [textExploding, setTextExploding] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const pageRef = useRef(null)
  const timeoutRefs = useRef([])

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Chaos progression timeline
  useEffect(() => {
    const chaosTimeline = [
      { delay: 3000, action: () => setChaosLevel(1) }, // Start subtle chaos
      { delay: 6000, action: () => setIsScrollReversed(true) }, // Reverse scrolling
      { delay: 9000, action: () => setChaosLevel(2) }, // More chaos
      { delay: 12000, action: () => setButtonsRunning(true) }, // Buttons run away
      { delay: 15000, action: () => setChaosLevel(3) }, // Maximum chaos
      { delay: 18000, action: () => setTextExploding(true) }, // Text explosion
      { delay: 20000, action: () => setChaosMessage(getRandomChaosMessage()) }
    ]

    chaosTimeline.forEach(({ delay, action }) => {
      const timeout = setTimeout(action, delay)
      timeoutRefs.current.push(timeout)
    })

    return () => {
      timeoutRefs.current.forEach(clearTimeout)
    }
  }, [])

  // Flying elements animation
  useEffect(() => {
    if (chaosLevel >= 2) {
      const interval = setInterval(() => {
        const newElement = {
          id: Math.random(),
          emoji: getRandomChaosElement(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 1.5
        }
        setFlyingElements(prev => [...prev.slice(-20), newElement])
      }, 200)

      return () => clearInterval(interval)
    }
  }, [chaosLevel])

  // Reverse scroll behavior
  useEffect(() => {
    if (isScrollReversed && pageRef.current) {
      const handleWheel = (e) => {
        e.preventDefault()
        pageRef.current.scrollTop -= e.deltaY
      }
      
      pageRef.current.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        if (pageRef.current) {
          pageRef.current.removeEventListener('wheel', handleWheel)
        }
      }
    }
  }, [isScrollReversed])

  // Button running away logic
  const getButtonStyle = (baseStyle = {}) => {
    if (!buttonsRunning) return baseStyle
    
    const distance = 150
    const angle = Math.random() * Math.PI * 2
    const offsetX = Math.cos(angle) * distance
    const offsetY = Math.sin(angle) * distance
    
    return {
      ...baseStyle,
      transform: `translate(${offsetX}px, ${offsetY}px) rotate(${Math.random() * 20 - 10}deg)`,
      transition: 'transform 0.3s ease-out'
    }
  }

  // Text explosion effect
  const ExplodingText = ({ children, delay = 0 }) => {
    const [exploded, setExploded] = useState(false)
    
    useEffect(() => {
      if (textExploding) {
        setTimeout(() => setExploded(true), delay)
      }
    }, [textExploding, delay])

    if (!exploded) return <span>{children}</span>

    return (
      <span className="relative inline-block">
        {children.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200,
              rotate: Math.random() * 360,
              scale: Math.random() * 2 + 0.5
            }}
            transition={{ duration: 2, delay: index * 0.05 }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    )
  }

  return (
    <motion.div 
      ref={pageRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen overflow-auto relative ${
        chaosLevel >= 3 ? 'bg-gradient-to-br from-red-500 via-purple-500 to-yellow-500' : 
        chaosLevel >= 2 ? 'bg-gradient-to-br from-blue-500 via-green-500 to-purple-500' :
        chaosLevel >= 1 ? 'bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50' :
        'bg-gradient-to-br from-gray-50 to-blue-50'
      } transition-all duration-1000`}
      style={{
        transform: chaosLevel >= 3 ? `rotate(${Math.sin(Date.now() / 1000) * 5}deg)` : 'none'
      }}
    >
      {/* Flying chaos elements */}
      <AnimatePresence>
        {flyingElements.map(element => (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: element.scale,
              x: element.x,
              y: element.y,
              rotate: element.rotation
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2 }}
            className="fixed pointer-events-none text-4xl z-50"
            style={{ left: 0, top: 0 }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Chaos message overlay */}
      {chaosMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="text-6xl font-bold text-red-500 animate-pulse">
            {chaosMessage}
          </div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex items-center gap-2"
            style={getButtonStyle()}
            onMouseEnter={() => buttonsRunning && setChaosLevel(prev => prev + 0.1)}
          >
            <ArrowLeft className="w-4 h-4" />
            <ExplodingText delay={0}>Back</ExplodingText>
          </Button>
          <h1 className={`text-4xl font-bold ${chaosLevel >= 2 ? 'text-white' : 'text-gray-800'}`}>
            <ExplodingText delay={100}>
              {chaosContent.title}
            </ExplodingText>
          </h1>
          <Zap className={`w-8 h-8 ${chaosLevel >= 2 ? 'text-yellow-300' : 'text-blue-500'}`} />
        </div>

        {/* Subtitle */}
        <div className="text-center mb-12">
          <h2 className={`text-2xl ${chaosLevel >= 2 ? 'text-yellow-200' : 'text-gray-600'} mb-4`}>
            <ExplodingText delay={200}>
              {chaosContent.subtitle}
            </ExplodingText>
          </h2>
        </div>

        {/* Content sections */}
        {chaosContent.sections.map((section, index) => (
          <Card key={section.id} className={`mb-8 ${chaosLevel >= 2 ? 'bg-black/20 border-white/30' : ''}`}>
            <CardHeader>
              <CardTitle className={chaosLevel >= 2 ? 'text-white' : 'text-gray-800'}>
                <ExplodingText delay={300 + index * 100}>
                  {section.title}
                </ExplodingText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`space-y-4 ${chaosLevel >= 2 ? 'text-gray-200' : 'text-gray-700'}`}>
                {section.content.split('\n\n').map((paragraph, pIndex) => (
                  <p key={pIndex} className="leading-relaxed">
                    <ExplodingText delay={400 + index * 100 + pIndex * 50}>
                      {paragraph}
                    </ExplodingText>
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Call to action buttons */}
        <div className="text-center space-y-4 mt-12">
          <Button 
            size="lg" 
            className="mr-4"
            style={getButtonStyle()}
            onMouseEnter={() => buttonsRunning && setFlyingElements(prev => [...prev, {
              id: Math.random(),
              emoji: getRandomChaosElement(),
              x: cursorPosition.x,
              y: cursorPosition.y,
              rotation: Math.random() * 360,
              scale: 1
            }])}
          >
            <ExplodingText delay={800}>Start Your Transformation</ExplodingText>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            style={getButtonStyle()}
          >
            <ExplodingText delay={850}>Learn More</ExplodingText>
          </Button>
        </div>

        {/* Hidden chaos trigger */}
        {chaosLevel >= 3 && (
          <div className="fixed bottom-4 right-4 text-xs text-white/50">
            <ExplodingText delay={1000}>
              Chaos Level: {chaosLevel.toFixed(1)}
            </ExplodingText>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('home')

  const games = [
    {
      id: 'daily-grind',
      title: 'The Daily Grind',
      description: 'Click to grind coffee beans while avoiding workplace distractions. How long can you stay focused?',
      icon: dailyGrindIcon,
      component: DailyGrindGame
    },
    {
      id: 'procrastination-station',
      title: 'Procrastination Station',
      description: 'Navigate through hilariously relatable scenarios of avoiding work. Choose your procrastination adventure!',
      icon: procrastinationIcon,
      component: ProcrastinationStation
    },
    {
      id: 'mug-shot',
      title: 'Mug Shot',
      description: 'How many coffee mugs can you shoot in 3 minutes? Race against time for the highest score!',
      icon: mugShotIcon,
      component: MugShotGame
    },
    {
      id: 'reaction-time',
      title: 'Reaction Time',
      description: 'Test your lightning-fast reflexes! Click as soon as the screen turns green. How quick are you?',
      icon: reactionTimeIcon,
      component: ReactionTimeGame
    },
    {
      id: 'useless-facts',
      title: 'Useless Facts',
      description: 'Discover fascinating, completely pointless facts that will impress absolutely no one at parties.',
      icon: uselessFactsIcon,
      component: UselessFacts
    },
    {
      id: 'chaos-page',
      title: 'Productivity Center',
      description: 'Revolutionary methods to enhance your productivity. Scientifically proven techniques await!',
      icon: chaosPageIcon,
      component: ChaosPage
    }
  ]

  const currentGame = games.find(game => game.id === currentView)

  if (currentGame) {
    const GameComponent = currentGame.component
    return <GameComponent onBack={() => setCurrentView('home')} />
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-10"></div>
        <img 
          src={heroImage} 
          alt="Coffee Break Hero" 
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-6xl font-bold mb-4 drop-shadow-lg"
            >
              Coffee Break Escape
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl mb-8 drop-shadow-md"
            >
              Your perfect companion for those precious moments of procrastination
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
                onClick={() => document.getElementById('games').scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Escape
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Distraction</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Six delightfully pointless activities designed to help you waste time with style and sophistication.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="cursor-pointer"
                onClick={() => setCurrentView(game.id)}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-amber-300 flex flex-col">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <img src={game.icon} alt={game.title} className="w-12 h-12 object-contain" />
                    </div>
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow pt-0">
                    <CardDescription className="text-center text-sm leading-relaxed flex-grow mb-4">
                      {game.description}
                    </CardDescription>
                    <Button className="w-full" variant="outline" size="sm">
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="w-6 h-6" />
            <span className="text-lg font-semibold">Coffee Break Escape</span>
          </div>
          <p className="text-gray-400">
            Proudly helping professionals procrastinate since today. Remember: the best work happens after the perfect break.
          </p>
        </div>
      </footer>
      <CookieConsent />
    </motion.div>
  )
}

export default App

