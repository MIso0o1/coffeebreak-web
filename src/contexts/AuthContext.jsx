import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, authHelpers } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Get initial session
    authHelpers.getSession().then((session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email, password, username) => {
    const { data, error } = await authHelpers.signUp(email, password, username)
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await authHelpers.signIn(email, password)
    return { data, error }
  }

  const signOut = async () => {
    console.log('AuthContext: Starting aggressive sign out...');
    
    try {
      // 1. Tell Supabase to sign out (with a short timeout)
      await Promise.race([
        authHelpers.signOut(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000))
      ]).catch(err => console.warn('Signout call timed out or failed, proceeding with local clear'));

      // 2. Clear ALL possible storage locations
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      console.log('AuthContext: Sign out complete');
    } catch (err) {
      console.error('AuthContext: Sign out error', err);
    }
    return { error: null };
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
