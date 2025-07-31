import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { ArrowLeft, Play, RefreshCw } from 'lucide-react';

const ReactionTimeGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('idle'); // idle, waiting, ready, playing, finished
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [error, setError] = useState(false);

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);
    setError(false);
    const newTimeoutId = setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, Math.random() * 3000 + 1000); // Random delay between 1-4 seconds
    setTimeoutId(newTimeoutId);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      clearTimeout(timeoutId);
      setError(true);
      setGameState('finished');
      setReactionTime(0); // Indicate early click
    } else if (gameState === 'ready') {
      const endTime = Date.now();
      setReactionTime(endTime - startTime);
      setGameState('finished');
    } else if (gameState === 'finished' || gameState === 'idle') {
      startGame();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getMessage = () => {
    if (gameState === 'idle') return 'Click to start';
    if (gameState === 'waiting') return 'Wait for green...';
    if (gameState === 'ready') return 'Click NOW!';
    if (gameState === 'finished') {
      if (error) return 'Too soon! Click to try again.';
      return `Your reaction time: ${reactionTime} ms. Click to play again.`;
    }
    return '';
  };

  const getBackgroundColor = () => {
    if (gameState === 'ready') return 'bg-green-500';
    if (error) return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">Reaction Time Challenge</h1>
        </div>

        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle>Test Your Reflexes!</CardTitle>
            <CardDescription>
              Click the box as soon as it turns green.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`w-full h-64 flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200 ${getBackgroundColor()}`}
              onClick={handleClick}
            >
              <motion.p 
                key={getMessage()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-3xl font-bold"
              >
                {getMessage()}
              </motion.p>
            </div>
            
            {gameState === 'finished' && (
              <div className="mt-4 space-y-2">
                {error ? (
                  <p className="text-red-600 font-semibold">You clicked too early!</p>
                ) : (
                  <p className="text-lg font-semibold">Your Reaction Time: <span className="text-blue-600 text-2xl">{reactionTime}</span> ms</p>
                )}
                <Button onClick={startGame} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" /> Play Again
                </Button>
              </div>
            )}
            {gameState === 'idle' && (
              <div className="mt-4">
                <Button onClick={startGame} className="w-full">
                  <Play className="w-4 h-4 mr-2" /> Start Game
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ReactionTimeGame;

