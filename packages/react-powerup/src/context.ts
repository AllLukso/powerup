import { PowerUP, Profile } from '@strandgeek/powerup';
import { createContext } from 'react'

export interface WalletContext {
  isConnected: boolean;
  connect: () => void;
  powerup: PowerUP | null;
  address: string | null;
  profile: Profile | null;
  provider: any | null;
  loading: boolean;
}

export const walletContext = createContext<WalletContext>({
  isConnected: false,
  connect: () => null,
  powerup: null,
  address: null,
  profile: null,
  provider: null,
  loading: false,
});
