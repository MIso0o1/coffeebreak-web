import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { gameStatsHelpers } from '../lib/supabase'

export const useGameStats = () => {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const saveGameScore = async (gameId, score, metadata = {}) => {
    console.log('saveGameScore called with:', { gameId, score, userId: user?.id })
    
    if (!user) {
      console.log('User not logged in, skipping stats save')
      return { success: false, error: 'User not logged in' }
    }

    setSaving(true)
    setError(null)

    try {
      console.log('Calling gameStatsHelpers.saveGameStats with user.id:', user.id)
      const { data, error } = await gameStatsHelpers.saveGameStats(
        user.id,
        gameId,
        score,
        metadata
      )

      console.log('Response from saveGameStats:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Score saved successfully:', data)
      setSaving(false)
      return { success: true, data }
    } catch (err) {
      console.error('Error saving game stats:', err)
      setError(err.message)
      setSaving(false)
      return { success: false, error: err.message }
    }
  }

  const getBestScore = async (gameId) => {
    if (!user) return { data: null, error: 'User not logged in' }

    try {
      const { data, error } = await gameStatsHelpers.getBestScore(user.id, gameId)
      return { data, error }
    } catch (err) {
      console.error('Error fetching best score:', err)
      return { data: null, error: err.message }
    }
  }

  return {
    saveGameScore,
    getBestScore,
    saving,
    error,
    isLoggedIn: !!user
  }
}
