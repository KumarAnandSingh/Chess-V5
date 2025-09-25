import React from 'react';
import { PlayerInfo } from '../../services/socketManager';

interface PlayerInfoCardProps {
  player: PlayerInfo;
  isPlayerTurn: boolean;
  color: 'white' | 'black';
}

const getRatingColor = (rating: number): string => {
  if (rating >= 2000) return 'text-purple-400';
  if (rating >= 1600) return 'text-blue-400';
  if (rating >= 1200) return 'text-green-400';
  if (rating >= 800) return 'text-yellow-400';
  return 'text-gray-400';
};

const getRatingTitle = (rating: number): string => {
  if (rating >= 2400) return 'Master';
  if (rating >= 2000) return 'Expert';
  if (rating >= 1600) return 'Advanced';
  if (rating >= 1200) return 'Intermediate';
  if (rating >= 800) return 'Beginner';
  return 'Novice';
};

const PlayerInfoCard: React.FC<PlayerInfoCardProps> = ({ player, isPlayerTurn, color }) => {
  const ratingColorClass = getRatingColor(player.rating);
  const ratingTitle = getRatingTitle(player.rating);
  
  const borderClass = isPlayerTurn 
    ? 'border-primary-500/60 shadow-primary-500/20 shadow-lg' 
    : 'border-gray-600/30';

  return (
    <div className={`glass-panel p-4 transition-all duration-200 ${borderClass}`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            color === 'white' ? 'bg-white/10' : 'bg-gray-800/50'
          }`}>
            {color === 'white' ? '♔' : '♚'}
          </div>
          {isPlayerTurn && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-background-900"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold truncate">{player.username}</h3>
            {isPlayerTurn && (
              <div className="text-xs text-green-400 animate-pulse">●</div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`text-sm font-mono font-bold ${ratingColorClass}`}>
              {player.rating}
            </div>
            <div className="text-xs text-gray-400">
              {ratingTitle}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 capitalize mt-1">
            Playing {color}
          </div>
        </div>
      </div>

      {isPlayerTurn && (
        <div className="mt-3 pt-3 border-t border-gray-600/30">
          <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">To move</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerInfoCard;