import React, { useState, useRef, useEffect } from 'react';
import { useMultiplayerStore, ChatMessage } from '../../stores/multiplayerStore';
import { socketManager } from '../../services/socketManager';

interface GameChatProps {
  gameId: string;
}

const GameChat: React.FC<GameChatProps> = ({ gameId }) => {
  const { currentGame, playerInfo, addChatMessage } = useMultiplayerStore();
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentGame.chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || currentGame.isSpectating) return;

    try {
      socketManager.sendChatMessage(gameId, message.trim());
      
      // Add message optimistically to UI
      const chatMessage: ChatMessage = {
        id: 'temp-' + Date.now(),
        username: playerInfo?.username || 'You',
        message: message.trim(),
        timestamp: new Date(),
        type: 'chat',
      };
      addChatMessage(chatMessage);
      
      setMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStyle = (msg: ChatMessage): string => {
    switch (msg.type) {
      case 'system':
        return 'text-blue-400 bg-blue-400/10 border-l-2 border-blue-400/50 pl-3';
      case 'draw_offer':
        return 'text-orange-400 bg-orange-400/10 border-l-2 border-orange-400/50 pl-3';
      case 'resignation':
        return 'text-red-400 bg-red-400/10 border-l-2 border-red-400/50 pl-3';
      default:
        return 'text-gray-300';
    }
  };

  const quickMessages = [
    'Good game!',
    'Nice move!',
    'Thanks!',
    'Good luck!',
  ];

  const handleQuickMessage = (quickMsg: string) => {
    if (currentGame.isSpectating) return;
    setMessage(quickMsg);
    inputRef.current?.focus();
  };

  return (
    <div className="glass-panel flex flex-col h-96">
      <div 
        className="flex items-center justify-between p-3 border-b border-gray-600/30 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span>💬</span>
          Chat
          {currentGame.chatMessages.length > 0 && (
            <span className="text-xs bg-primary-600 text-white px-1.5 py-0.5 rounded-full">
              {currentGame.chatMessages.length}
            </span>
          )}
        </h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {currentGame.chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                <div className="text-2xl mb-2">💭</div>
                <p>No messages yet</p>
                <p className="text-xs mt-1">
                  {currentGame.isSpectating 
                    ? 'Spectators cannot send messages' 
                    : 'Send a message to start the conversation'
                  }
                </p>
              </div>
            ) : (
              currentGame.chatMessages.map((msg) => (
                <div key={msg.id} className={`text-sm ${getMessageStyle(msg)} rounded p-2`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {msg.type === 'chat' && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white truncate">{msg.username}</span>
                          <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                        </div>
                      )}
                      <div className={msg.type === 'chat' ? '' : 'font-medium'}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick messages */}
          {!currentGame.isSpectating && currentGame.gameState?.status === 'active' && (
            <div className="px-3 pb-2">
              <div className="flex flex-wrap gap-1">
                {quickMessages.map((quickMsg) => (
                  <button
                    key={quickMsg}
                    onClick={() => handleQuickMessage(quickMsg)}
                    className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
                  >
                    {quickMsg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message input */}
          <div className="p-3 border-t border-gray-600/30">
            {currentGame.isSpectating ? (
              <div className="text-center text-gray-500 text-sm py-2">
                <span>👀 Spectator mode - Chat disabled</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-colors"
                  maxLength={200}
                  disabled={!currentGame.gameState || currentGame.gameState.status !== 'active'}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || !currentGame.gameState || currentGame.gameState.status !== 'active'}
                  className="px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            )}
            
            {message.length > 150 && (
              <div className="text-xs text-gray-400 mt-1">
                {200 - message.length} characters remaining
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GameChat;