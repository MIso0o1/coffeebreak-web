import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { X, Trophy, TrendingUp, Calendar, Target, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const GameStatsModal = ({ isOpen, onClose }) => {
  const { user, session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([])
  const [totalGames, setTotalGames] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && user) {
      fetchStatsDirectly()
    }
  }, [isOpen, user])

  const fetchStatsDirectly = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const supabaseUrl = 'https://goiszakfrahcmtxsatje.supabase.co'
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaXN6YWtmcmFoY210eHNhdGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTU2MDksImV4cCI6MjA4MjYzMTYwOX0.0tUiMUZX8mgCzX6ox6iOqsCky-dx3W50pCumuBgFYYE'
      
      // Use the same method as your working saveGameStats
      const response = await fetch(
        `${supabaseUrl}/rest/v1/game_stats?user_id=eq.${user.id}&order=played_at.desc`,
        {
          method: 'GET',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${session?.access_token || supabaseAnonKey}`
          }
        }
      )

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errText}`)
      }

      const data = await response.json()
      setStats(data || [])
      setTotalGames(data?.length || 0)
      setLoading(false)
    } catch (err) {
      console.error('Direct fetch error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const getGameStats = () => {
    const gameGroups = {}
    stats.forEach(stat => {
      if (!gameGroups[stat.game_id]) {
        gameGroups[stat.game_id] = {
          gameId: stat.game_id,
          gameName: formatGameName(stat.game_id),
          totalPlays: 0,
          bestScore: 0,
          averageScore: 0,
          scores: []
        }
      }
      gameGroups[stat.game_id].totalPlays++
      gameGroups[stat.game_id].scores.push(stat.score)
      
      // For reaction-time, lower is better. For others, higher is better.
      if (stat.game_id === 'reaction-time') {
        if (gameGroups[stat.game_id].bestScore === 0 || stat.score < gameGroups[stat.game_id].bestScore) {
          gameGroups[stat.game_id].bestScore = stat.score
        }
      } else {
        if (stat.score > gameGroups[stat.game_id].bestScore) {
          gameGroups[stat.game_id].bestScore = stat.score
        }
      }
    })
    Object.values(gameGroups).forEach(game => {
      game.averageScore = Math.round(game.scores.reduce((a, b) => a + b, 0) / game.scores.length)
    })
    return Object.values(gameGroups)
  }

  const formatGameName = (gameId) => {
    const names = {
      'daily-grind': 'The Daily Grind',
      'procrastination-station': 'Procrastination Station',
      'mug-shot': 'Mug Shot',
      'reaction-time': 'Reaction Time',
      'true-color': 'True Color Challenge',
      'unique-challenge': 'Unique Challenge'
    }
    return names[gameId] || gameId
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) return null

  const gameStats = getGameStats()
  const bestGame = gameStats.reduce((best, game) => {
    if (!best) return game;
    // For comparison in "Best Game" card, we need a normalized way to compare.
    // This is tricky because reaction time is lower=better while others are higher=better.
    // For now, let's just use the one with the most plays or highest score.
    return game.totalPlays > best.totalPlays ? game : best;
  }, null)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="relative">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 z-10" onClick={onClose}><X className="w-4 h-4" /></Button>
            <CardHeader>
              <CardTitle className="text-3xl">Your Game Statistics</CardTitle>
              <CardDescription>Track your progress and achievements across all games</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
                  <p className="text-gray-500">Loading your stats...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Error Loading Stats</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <Button onClick={fetchStatsDirectly}>Try Again</Button>
                </div>
              ) : stats.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No stats yet!</h3>
                  <p className="text-gray-600">Start playing games to track your progress</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600 mb-1">Total Games</p><p className="text-3xl font-bold text-amber-600">{totalGames}</p></div><Target className="w-10 h-10 text-amber-600" /></div></CardContent></Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600 mb-1">Games Played</p><p className="text-3xl font-bold text-blue-600">{gameStats.length}</p></div><Trophy className="w-10 h-10 text-blue-600" /></div></CardContent></Card>
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600 mb-1">Best Game</p><p className="text-lg font-bold text-green-600 truncate">{bestGame?.gameName || 'N/A'}</p></div><TrendingUp className="w-10 h-10 text-green-600" /></div></CardContent></Card>
                  </div>
                  <Tabs defaultValue="by-game" className="w-full">
                    <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="by-game">By Game</TabsTrigger><TabsTrigger value="recent">Recent Plays</TabsTrigger></TabsList>
                    <TabsContent value="by-game" className="space-y-4 mt-4">
                      {gameStats.map((game) => (
                        <Card key={game.gameId}><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-xl">{game.gameName}</CardTitle><Badge variant="secondary">{game.totalPlays} plays</Badge></div></CardHeader><CardContent><div className="grid grid-cols-2 gap-4"><div><p className="text-sm text-gray-600 mb-1">Best Score</p><p className="text-2xl font-bold text-amber-600">{game.bestScore}</p></div><div><p className="text-sm text-gray-600 mb-1">Average Score</p><p className="text-2xl font-bold text-blue-600">{game.averageScore}</p></div></div></CardContent></Card>
                      ))}
                    </TabsContent>
                    <TabsContent value="recent" className="space-y-3 mt-4">
                      {stats.slice(0, 10).map((stat, index) => (
                        <Card key={stat.id || index}><CardContent className="pt-6"><div className="flex items-center justify-between"><div className="flex-1"><p className="font-semibold text-lg mb-1">{formatGameName(stat.game_id)}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(stat.played_at)}</p></div><div className="text-right"><p className="text-sm text-gray-600 mb-1">Score</p><p className="text-2xl font-bold text-amber-600">{stat.score}</p></div></div></CardContent></Card>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
