import React, { useState, useEffect } from 'react';
import { Clock, Users, Target, X, Settings, Zap, Search } from 'lucide-react';
import { TimeControl } from '../../types/multiplayer';
import { useMatchmaking, useConnectionStatus, useMultiplayerStore } from '../../stores/multiplayerStore';
import { ConnectionStatusFull } from './ConnectionStatus';
import { cn } from '../../lib/utils';

interface TimeControlOption {
  name: string;
  type: 'bullet' | 'blitz' | 'rapid' | 'classical';
  initialTime: number; // in seconds
  increment: number; // in seconds
  description: string;
  icon: React.ReactNode;
}

const timeControlOptions: TimeControlOption[] = [
  {
    name: '1+0',
    type: 'bullet',
    initialTime: 60,
    increment: 0,
    description: '1 minute',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    name: '1+1',
    type: 'bullet',
    initialTime: 60,
    increment: 1,
    description: '1 min + 1 sec',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    name: '3+0',
    type: 'blitz',
    initialTime: 180,
    increment: 0,
    description: '3 minutes',
    icon: <Clock className="h-4 w-4" />,
  },
  {
    name: '3+2',
    type: 'blitz',
    initialTime: 180,
    increment: 2,
    description: '3 min + 2 sec',
    icon: <Clock className="h-4 w-4" />,
  },
  {
    name: '5+0',
    type: 'blitz',
    initialTime: 300,
    increment: 0,
    description: '5 minutes',
    icon: <Clock className="h-4 w-4" />,
  },
  {
    name: '5+3',
    type: 'blitz',
    initialTime: 300,
    increment: 3,
    description: '5 min + 3 sec',
    icon: <Clock className="h-4 w-4" />,
  },
  {
    name: '10+0',
    type: 'rapid',
    initialTime: 600,
    increment: 0,
    description: '10 minutes',
    icon: <Target className="h-4 w-4" />,
  },
  {
    name: '15+10',
    type: 'rapid',
    initialTime: 900,
    increment: 10,
    description: '15 min + 10 sec',
    icon: <Target className="h-4 w-4" />,
  },
];

interface MatchmakingQueueProps {
  className?: string;
  onGameFound?: () => void;
}

export const MatchmakingQueue: React.FC<MatchmakingQueueProps> = ({
  className,
  onGameFound
}) => {
  const connectionStatus = useConnectionStatus();
  const currentPlayer = useMultiplayerStore(state => state.currentPlayer);
  const { isInQueue, queueInfo, joinMatchmaking, leaveMatchmaking } = useMatchmaking();
  
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControlOption>(timeControlOptions[2]); // 3+0 default
  const [ratingRange, setRatingRange] = useState<{ min: number; max: number } | null>(null);
  const [useRatingRange, setUseRatingRange] = useState(false);
  const [queueTime, setQueueTime] = useState(0);

  // Queue timer
  useEffect(() => {
    if (!isInQueue) {
      setQueueTime(0);
      return;
    }

    const interval = setInterval(() => {
      setQueueTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isInQueue]);

  // Reset queue time when joining
  useEffect(() => {
    if (isInQueue && queueTime === 0 && queueInfo?.joinedAt) {
      const joinTime = new Date(queueInfo.joinedAt).getTime();
      const now = Date.now();
      setQueueTime(Math.floor((now - joinTime) / 1000));
    }
  }, [isInQueue, queueInfo?.joinedAt, queueTime]);

  const handleJoinQueue = () => {
    if (!currentPlayer || connectionStatus !== 'connected') return;

    const timeControl: TimeControl = {
      initialTime: selectedTimeControl.initialTime,
      increment: selectedTimeControl.increment,
      type: selectedTimeControl.type,
    };

    const range = useRatingRange && ratingRange ? ratingRange : undefined;
    joinMatchmaking(timeControl, range);
  };

  const handleLeaveQueue = () => {
    leaveMatchmaking();
    setQueueTime(0);
  };

  const formatQueueTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bullet':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'blitz':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rapid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'classical':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (connectionStatus !== 'connected') {
    return (
      <div className={cn('p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Play Online</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Connect to start matchmaking</p>
          <ConnectionStatusFull />
        </div>
      </div>
    );
  }

  if (isInQueue) {
    return (
      <div className={cn('p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
        <div className="text-center">
          {/* Queue Status */}
          <div className="mb-6">
            <Search className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Searching for opponent...
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Looking for a {selectedTimeControl.name} game
            </p>
          </div>

          {/* Queue Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 dark:text-gray-400">Queue time</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  {formatQueueTime(queueTime)}
                </div>
              </div>
              {queueInfo?.queuePosition && (
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Position</div>
                  <div className="font-bold text-lg text-gray-900 dark:text-white">
                    #{queueInfo.queuePosition}
                  </div>
                </div>
              )}
              {queueInfo?.estimatedWaitTime && (
                <div className="col-span-2">
                  <div className="text-gray-500 dark:text-gray-400">Estimated wait</div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    ~{Math.ceil(queueInfo.estimatedWaitTime / 60)} minutes
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Time Control Info */}
          <div className="flex items-center justify-center gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2">
              {selectedTimeControl.icon}
              <span className="font-medium">{selectedTimeControl.name}</span>
            </div>
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              getTypeColor(selectedTimeControl.type)
            )}>
              {selectedTimeControl.type}
            </span>
          </div>

          {/* Cancel Button */}
          <button
            onClick={handleLeaveQueue}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Cancel Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Play Online</h2>
        <p className="text-gray-600 dark:text-gray-400">Choose your time control and find an opponent</p>
      </div>

      {/* Time Control Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Time Control</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timeControlOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => setSelectedTimeControl(option)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all duration-200 text-left',
                selectedTimeControl.name === option.name
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {option.icon}
                <span className="font-bold text-gray-900 dark:text-white">{option.name}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {option.description}
              </div>
              <span className={cn(
                'inline-block px-2 py-0.5 rounded text-xs font-medium',
                getTypeColor(option.type)
              )}>
                {option.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Rating Range (Optional) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            id="useRatingRange"
            checked={useRatingRange}
            onChange={(e) => setUseRatingRange(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label htmlFor="useRatingRange" className="text-sm font-medium text-gray-900 dark:text-white">
            Limit opponent rating range
          </label>
        </div>

        {useRatingRange && currentPlayer && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Rating
                </label>
                <input
                  type="number"
                  value={ratingRange?.min || Math.max(100, currentPlayer.rating - 200)}
                  onChange={(e) => setRatingRange(prev => ({
                    min: parseInt(e.target.value) || 0,
                    max: prev?.max || currentPlayer.rating + 200
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="100"
                  max="3000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum Rating
                </label>
                <input
                  type="number"
                  value={ratingRange?.max || currentPlayer.rating + 200}
                  onChange={(e) => setRatingRange(prev => ({
                    min: prev?.min || Math.max(100, currentPlayer.rating - 200),
                    max: parseInt(e.target.value) || 3000
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="100"
                  max="3000"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Your rating: {currentPlayer.rating}
            </p>
          </div>
        )}
      </div>

      {/* Join Queue Button */}
      <button
        onClick={handleJoinQueue}
        disabled={!currentPlayer || connectionStatus !== 'connected'}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Users className="h-5 w-5" />
        Find Opponent
      </button>

      {!currentPlayer && (
        <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 text-center">
          Please log in to play online games
        </p>
      )}
    </div>
  );
};