import React, { createContext, useState, useEffect, useContext } from "react";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

interface WalletContext {
  isConnected: boolean;
  connect: () => void;
  address: string | null;
  provider: any | null;
}

const walletContext = createContext<WalletContext>({
  isConnected: false,
  connect: () => null,
  address: null,
  provider: null,
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<any>();
  const { address, isConnected, connector } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  useEffect(() => {
    if (isConnected) {
      connector?.getProvider().then((provider) => setProvider(provider));
    }
  }, [connector, isConnected]);
  return (
    <walletContext.Provider
      value={{ isConnected, connect, address: address || null, provider }}
    >
      {children}
    </walletContext.Provider>
  );
};

export const useWallet = () => useContext(walletContext)
