import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { User, LogOut, Trophy, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const UserMenu = ({ onViewStats }) => {
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async (e) => {
    console.log('Sign out button clicked');
    try {
      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();
      
      // Wait for the sign out process to finish
      await signOut();
      
      console.log('Sign out successful');
      // No reload needed anymore, AuthContext will update the 'user' state
      // and the UI will automatically switch to the logged-out view.
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }

  const getInitials = () => {
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase()
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.username || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onViewStats} className="cursor-pointer">
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>My Stats</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Trophy className="mr-2 h-4 w-4" />
          <span>Leaderboards</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div 
          onClick={handleSignOut} 
          className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
