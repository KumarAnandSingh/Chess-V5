import React, { useState, useEffect } from 'react';

interface GameTimerProps {
  timeLeft: number; // milliseconds
  isActive: boolean;
  color: 'white' | 'black';
}

const GameTimer: React.FC<GameTimerProps> = ({ timeLeft, isActive, color }) => {
  const [displayTime, setDisplayTime] = useState(timeLeft);
  
  useEffect(() => {
    setDisplayTime(timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setDisplayTime(prev => Math.max(0, prev - 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes >= 10) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}`;
    }
  };

  const getTimeClass = (): string => {
    const seconds = displayTime / 1000;
    
    if (seconds <= 10) {
      return 'text-red-400 animate-pulse';
    } else if (seconds <= 30) {
      return 'text-orange-400';
    } else if (seconds <= 60) {
      return 'text-yellow-400';
    } else {
      return 'text-white';
    }
  };

  const getBackgroundClass = (): string => {
    const seconds = displayTime / 1000;
    const baseClass = 'glass-panel p-4 transition-all duration-200';
    
    if (isActive && seconds <= 10) {
      return `${baseClass} border-red-500/50 bg-red-500/10 shadow-red-500/20 shadow-lg`;
    } else if (isActive && seconds <= 30) {
      return `${baseClass} border-orange-500/50 bg-orange-500/5`;
    } else if (isActive) {
      return `${baseClass} border-primary-500/50`;
    } else {
      return baseClass;
    }
  };

  const circleProgress = Math.min(100, (displayTime / Math.max(1, timeLeft)) * 100);

  return (
    <div className={getBackgroundClass()}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="rgba(107, 114, 128, 0.3)"
                strokeWidth="2"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke={isActive ? (displayTime <= 10000 ? '#EF4444' : '#3B82F6') : '#6B7280'}
                strokeWidth="2"
                strokeDasharray={`${circleProgress * 0.88} ${100 * 0.88}`}
                className="transition-all duration-100"
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-xs ${
              color === 'white' ? 'text-gray-800' : 'text-gray-200'
            }`}>
              {color === 'white' ? '♔' : '♚'}
            </div>
          </div>
          
          <div>
            <div className={`text-xl font-mono font-bold ${getTimeClass()}`}>
              {formatTime(displayTime)}
            </div>
            <div className="text-xs text-gray-400 capitalize">
              {color} {isActive ? '(thinking)' : ''}
            </div>
          </div>
        </div>

        {isActive && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="text-xs text-green-400">Active</div>
          </div>
        )}
      </div>

      {displayTime <= 10000 && displayTime > 0 && isActive && (
        <div className="mt-2">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-400 transition-all duration-100 ease-linear"
              style={{ width: `${(displayTime / 10000) * 100}%` }}
            />
          </div>
        </div>
      )}

      {displayTime === 0 && (
        <div className="mt-2 text-center">
          <div className="text-red-400 text-sm font-bold animate-pulse">
            TIME'S UP!
          </div>
        </div>
      )}
    </div>
  );
};

export default GameTimer;