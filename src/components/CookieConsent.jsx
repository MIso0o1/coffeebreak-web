import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Cookie, X } from 'lucide-react'

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsAccepted(true)
    setTimeout(() => setIsVisible(false), 300)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Cookie className="w-5 h-5 text-amber-600 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    We use cookies to enhance your coffee break experience. 
                    <span className="font-medium"> Essential for the perfect brew!</span>
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      onClick={handleAccept}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 text-xs font-medium"
                    >
                      {isAccepted ? 'Accepted!' : 'Accept'}
                    </Button>
                    <Button 
                      onClick={handleDecline}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 text-xs"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 p-1 h-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent

