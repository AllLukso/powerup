import React, { useState, useEffect } from 'react'
import { configureChains, createClient, defaultChains, useAccount, useConnect, WagmiConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from 'wagmi/providers/public'
import { PowerUP, Profile } from '@strandgeek/powerup'
import { walletContext } from './context'

const { provider } = configureChains(defaultChains, [publicProvider()])

interface PowerupProviderProps {
  children: React.ReactNode
  autoConnect?: boolean
}

const PowerupContextProvider: React.FC<PowerupProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<any>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [powerup, setPowerup] = useState<PowerUP | null>(null);
  const { address, isConnected, connector } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  useEffect(() => {
    if (isConnected) {
      setLoading(true);
      connector?.getProvider().then(async (provider) => {
        setProvider(provider)
        if (!profile && address) {
          const powerup = new PowerUP({
            provider,
          })
          setPowerup(powerup);
          const profile = await powerup.getProfile(address);
          setProfile(profile)
        }
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [connector, isConnected]);
  return (
      <walletContext.Provider
        value={{ isConnected, connect, powerup, address: address || null, profile, provider, loading }}
      >
        {children}
      </walletContext.Provider>
  );
}; 


export const PowerupProvider: React.FC<PowerupProviderProps> = ({ children, autoConnect }) => {
  const client = createClient({
    autoConnect: autoConnect,
    provider,
  })
  return (
    <WagmiConfig client={client}>
      <PowerupContextProvider>{children}</PowerupContextProvider>
    </WagmiConfig>
  )
}
