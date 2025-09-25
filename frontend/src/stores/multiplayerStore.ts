import { create } from 'zustand';

interface MultiplayerStore {
  isConnected: boolean;
  isReconnecting: boolean;
  lastError: string | null;
  currentPlayer: any;
  connect: () => void;
  setConnected: (connected: boolean) => void;
  setReconnecting: (reconnecting: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPlayer: (player: any) => void;
}

export const useMultiplayerStore = create<MultiplayerStore>((set) => ({
  isConnected: false,
  isReconnecting: false,
  lastError: null,
  currentPlayer: null,
  connect: () => set({ isConnected: true }),
  setConnected: (connected) => set({ isConnected: connected }),
  setReconnecting: (reconnecting) => set({ isReconnecting: reconnecting }),
  setError: (error) => set({ lastError: error }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
}));

export const useConnectionStatus = () => {
  const { isConnected, isReconnecting, lastError } = useMultiplayerStore();
  return { isConnected, isReconnecting, lastError };
};

export const useMatchmaking = () => {
  const { currentPlayer } = useMultiplayerStore();
  return { currentPlayer };
};