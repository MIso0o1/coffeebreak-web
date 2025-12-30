# Coffee Break Escape - Supabase Integration Guide

## Overview

This guide explains how to set up and use the Supabase authentication and game stats tracking features that have been integrated into your Coffee Break Escape website.

## What's Been Added

### 1. **Authentication System**
- User registration with email, password, and username
- User login with email and password
- Persistent sessions across page refreshes
- User profile management
- Logout functionality

### 2. **Game Stats Tracking**
- Automatic saving of game scores when logged in
- View personal game statistics
- Track best scores and averages per game
- View recent game plays
- Total games played counter

### 3. **New Components**

#### `AuthModal.jsx`
A beautiful modal dialog with tabs for login and registration:
- Email and password validation
- Username creation for new users
- Error and success messages
- Loading states during authentication

#### `UserMenu.jsx`
A dropdown menu in the top-right corner showing:
- User profile information
- Link to view game statistics
- Logout option

#### `GameStatsModal.jsx`
A comprehensive stats dashboard displaying:
- Total games played
- Number of different games played
- Best performing game
- Detailed stats per game (best score, average, play count)
- Recent play history with timestamps

### 4. **Database Schema**

Two main tables have been designed:

#### `profiles` table
- Extends the default Supabase auth.users table
- Stores username and avatar URL
- Automatically created when a user signs up

#### `game_stats` table
- Stores individual game play records
- Links to user ID
- Records game ID, score, and metadata
- Timestamps each play

### 5. **Helper Functions**

#### Authentication Helpers (`lib/supabase.js`)
- `signUp()` - Register new users
- `signIn()` - Login existing users
- `signOut()` - Logout users
- `getCurrentUser()` - Get current user info
- `getSession()` - Get current session

#### Game Stats Helpers (`lib/supabase.js`)
- `saveGameStats()` - Save a game score
- `getUserGameStats()` - Get all user's game stats
- `getBestScore()` - Get user's best score for a game
- `getLeaderboard()` - Get top scores (ready for future use)
- `getTotalGamesPlayed()` - Get total play count

### 6. **React Context**

#### `AuthContext`
Provides authentication state throughout the app:
- `user` - Current user object
- `profile` - User profile data
- `session` - Current session
- `loading` - Authentication loading state
- `signUp()`, `signIn()`, `signOut()` - Auth methods

### 7. **Custom Hook**

#### `useGameStats`
Easy-to-use hook for game components:
- `saveGameScore()` - Save a score
- `getBestScore()` - Get best score
- `isLoggedIn` - Check if user is logged in
- `saving` - Loading state
- `error` - Error messages

## Setup Instructions

### Step 1: Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL script to create tables, policies, and triggers

This will create:
- The `profiles` and `game_stats` tables
- Row Level Security (RLS) policies
- Automatic profile creation trigger
- Indexes for better performance

### Step 2: Configure Email Settings (Optional)

For email verification and password reset:

1. Go to Authentication > Settings in Supabase
2. Configure your email templates
3. Set up SMTP settings (or use Supabase's default)

### Step 3: Install Dependencies

The Supabase client library has already been added to your project:

```bash
pnpm install
```

### Step 4: Run the Application

```bash
pnpm dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is busy).

## How It Works

### User Flow

1. **New User**
   - Clicks "Login / Register" button in top-right
   - Switches to "Register" tab
   - Enters username, email, and password
   - Account is created and profile is auto-generated
   - Email verification sent (if configured)

2. **Existing User**
   - Clicks "Login / Register" button
   - Enters email and password
   - Logged in automatically
   - User menu appears in top-right

3. **Playing Games**
   - User plays any game
   - When game ends, score is automatically saved (if logged in)
   - "Score saved!" message appears
   - Non-logged-in users see "Login to save your scores!"

4. **Viewing Stats**
   - Click on user avatar in top-right
   - Select "My Stats"
   - View comprehensive statistics dashboard
   - See best scores, averages, and recent plays

### Game Integration Example

The Daily Grind game has been updated to demonstrate stats tracking:

```javascript
const DailyGrindGame = ({ onBack }) => {
  const { saveGameScore, isLoggedIn } = useGameStats()
  const [score, setScore] = useState(0)
  const [statsSaved, setStatsSaved] = useState(false)

  // Auto-save when game ends
  useEffect(() => {
    if (!gameActive && timeLeft === 0 && score > 0 && !statsSaved && isLoggedIn) {
      saveGameScore('daily-grind', score, { distractionsHit: 0 })
      setStatsSaved(true)
    }
  }, [gameActive, timeLeft, score, statsSaved, isLoggedIn])

  // ... rest of game logic
}
```

### Adding Stats to Other Games

To add stats tracking to other games:

1. Import the hook:
```javascript
import { useGameStats } from '../hooks/useGameStats.js'
```

2. Use the hook in your component:
```javascript
const { saveGameScore, isLoggedIn } = useGameStats()
```

3. Save the score when game ends:
```javascript
saveGameScore('game-id', finalScore, { /* optional metadata */ })
```

4. Show appropriate messages:
```javascript
{!isLoggedIn && <p>Login to save your scores!</p>}
{isLoggedIn && statsSaved && <p>Score saved!</p>}
```

## Security Features

### Row Level Security (RLS)

All database tables have RLS enabled:

- Users can only read/write their own game stats
- Profiles are publicly viewable (for leaderboards)
- Users can only update their own profile

### Authentication

- Passwords are hashed and never stored in plain text
- Session tokens are securely managed by Supabase
- HTTPS is required for production use

## Future Enhancements

Ready-to-implement features:

1. **Leaderboards**
   - The `getLeaderboard()` function is already implemented
   - Just needs UI component to display top scores

2. **Achievements/Badges**
   - Add an `achievements` table
   - Track milestones (e.g., "Play 10 games", "Score over 100")

3. **Social Features**
   - Friend system
   - Challenge friends
   - Share scores

4. **Profile Customization**
   - Avatar upload
   - Display name
   - Bio

5. **Game History Charts**
   - Score progression over time
   - Performance analytics
   - Comparison charts

## Troubleshooting

### Common Issues

**"User not logged in" when trying to save stats**
- Check that the user is authenticated
- Verify the AuthProvider wraps your App component
- Check browser console for auth errors

**Stats not appearing in dashboard**
- Verify the game ID matches exactly (e.g., 'daily-grind')
- Check that scores are being saved (browser console)
- Verify RLS policies are set up correctly

**Email verification not working**
- Configure SMTP settings in Supabase
- Check spam folder
- Disable email verification for development

**Database errors**
- Ensure all SQL from `database-schema.sql` was executed
- Check RLS policies are enabled
- Verify table structure matches schema

## API Reference

### useAuth Hook

```javascript
const {
  user,        // Current user object or null
  profile,     // User profile data
  session,     // Current session
  loading,     // Auth loading state
  signUp,      // (email, password, username) => Promise
  signIn,      // (email, password) => Promise
  signOut      // () => Promise
} = useAuth()
```

### useGameStats Hook

```javascript
const {
  saveGameScore,  // (gameId, score, metadata) => Promise
  getBestScore,   // (gameId) => Promise
  isLoggedIn,     // boolean
  saving,         // boolean
  error          // string | null
} = useGameStats()
```

## Support

For issues or questions:
- Check the Supabase documentation: https://supabase.com/docs
- Review the code comments in the implementation files
- Check browser console for error messages

## Credits

Implementation by Manus AI
Original website by Michal Šomský
