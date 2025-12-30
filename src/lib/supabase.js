import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://goiszakfrahcmtxsatje.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaXN6YWtmcmFoY210eHNhdGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTU2MDksImV4cCI6MjA4MjYzMTYwOX0.0tUiMUZX8mgCzX6ox6iOqsCky-dx3W50pCumuBgFYYE'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authHelpers = {
  // Sign up new user
  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    })
    return { data, error }
  },

  // Sign in existing user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get current session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}

// Game stats helper functions
export const gameStatsHelpers = {
  // Save game stats using REST API directly
  saveGameStats: async (userId, gameId, score, metadata = {}) => {
    console.log('saveGameStats: Starting with', { userId, gameId, score })
    
    try {
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token || supabaseAnonKey

      const payload = {
        user_id: userId,
        game_id: gameId,
        score: score,
        metadata: metadata,
        played_at: new Date().toISOString()
      }
      
      console.log('saveGameStats: Payload', payload)
      
      const response = await fetch(
        `${supabaseUrl}/rest/v1/game_stats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      )
      
      console.log('saveGameStats: Response status', response.status)
      
      if (!response.ok) {
        const error = await response.text()
        console.error('saveGameStats: HTTP error', error)
        return { data: null, error: new Error(error) }
      }
      
      // 201 status means success, even if body is empty
      if (response.status === 201) {
        console.log('saveGameStats: Success - data inserted')
        return { data: { success: true }, error: null }
      }
      
      // Try to parse JSON if there's a body
      const text = await response.text()
      let data = null
      if (text) {
        data = JSON.parse(text)
      }
      console.log('saveGameStats: Success', data)
      return { data, error: null }
    } catch (err) {
      console.error('saveGameStats: Exception', err)
      return { data: null, error: err }
    }
  },

  // Get user's game stats
  getUserGameStats: async (userId, gameId = null) => {
    let query = supabase
      .from('game_stats')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })

    if (gameId) {
      query = query.eq('game_id', gameId)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Get user's best score for a game
  getBestScore: async (userId, gameId) => {
    const { data, error } = await supabase
      .from('game_stats')
      .select('score')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .order('score', { ascending: false })
      .limit(1)

    return { data: data?.[0], error }
  },

  // Get leaderboard for a game
  getLeaderboard: async (gameId, limit = 10) => {
    const { data, error } = await supabase
      .from('game_stats')
      .select('user_id, score, played_at, profiles(username)')
      .eq('game_id', gameId)
      .order('score', { ascending: false })
      .limit(limit)

    return { data, error }
  },

  // Get user's total games played
  getTotalGamesPlayed: async (userId) => {
    const { count, error } = await supabase
      .from('game_stats')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    return { count, error }
  }
}
