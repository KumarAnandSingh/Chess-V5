import React from 'react';
import { Wifi, WifiOff, Loader2, AlertTriangle } from 'lucide-react';
import { useConnectionStatus, useMultiplayerStore } from '../../stores/multiplayerStore';
import { cn } from '../../lib/utils';

interface ConnectionStatusProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className,
  showText = true,
  size = 'md'
}) => {
  const connectionStatus = useConnectionStatus();
  const { reconnectAttemptsLeft, isReconnecting, lastError } = useMultiplayerStore(
    state => ({
      reconnectAttemptsLeft: state.isReconnecting ? 5 : 0, // This should come from websocketManager
      isReconnecting: state.isReconnecting,
      lastError: state.lastError,
    })
  );

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: Wifi,
          text: 'Connected',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
        };
      case 'connecting':
        return {
          icon: Loader2,
          text: 'Connecting...',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          animate: true,
        };
      case 'reconnecting':
        return {
          icon: Loader2,
          text: `Reconnecting... (${reconnectAttemptsLeft} attempts left)`,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          animate: true,
        };
      case 'error':
        return {
          icon: AlertTriangle,
          text: lastError || 'Connection error',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
        };
      case 'disconnected':
      default:
        return {
          icon: WifiOff,
          text: 'Disconnected',
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'h-3 w-3',
      gap: 'gap-1',
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'h-4 w-4',
      gap: 'gap-2',
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'h-5 w-5',
      gap: 'gap-2',
    },
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border',
        'transition-all duration-200',
        sizeConfig.container,
        sizeConfig.gap,
        config.color,
        config.bgColor,
        config.borderColor,
        className
      )}
      title={config.text}
    >
      <Icon 
        className={cn(
          sizeConfig.icon,
          config.animate && 'animate-spin'
        )}
      />
      {showText && (
        <span className="font-medium truncate">
          {config.text}
        </span>
      )}
    </div>
  );
};

interface ConnectionStatusIndicatorProps {
  className?: string;
}

// Minimal indicator for nav bars
export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  className
}) => {
  return (
    <ConnectionStatus
      className={className}
      showText={false}
      size="sm"
    />
  );
};

// Full status with reconnect button
export const ConnectionStatusFull: React.FC<{ onReconnect?: () => void }> = ({
  onReconnect
}) => {
  const connectionStatus = useConnectionStatus();
  const { connect } = useMultiplayerStore();

  const handleReconnect = async () => {
    if (onReconnect) {
      onReconnect();
    } else {
      try {
        await connect();
      } catch (error) {
        console.error('Failed to reconnect:', error);
      }
    }
  };

  const showReconnectButton = connectionStatus === 'disconnected' || connectionStatus === 'error';

  return (
    <div className="flex items-center gap-3">
      <ConnectionStatus size="md" />
      {showReconnectButton && (
        <button
          onClick={handleReconnect}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reconnect
        </button>
      )}
    </div>
  );
};