import { WagmiConfig, createClient, configureChains, defaultChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { ProfileCard } from "./components/ProfileCard";
import { useWallet, WalletProvider } from "./providers/wallet";

const { provider } = configureChains(defaultChains, [publicProvider()])

const client = createClient({
  autoConnect: false,
  provider,
})

function App() {
  const { isConnected, connect, address } = useWallet()

  if (!isConnected) {
    return (
      <button className="btn btn-primary" onClick={() => connect()}>
        Connect
      </button>
    )
  }

  return (
    <div className="bg-base-200 w-full h-full">
      <div className="flex items-center justify-center w-screen h-screen">
        <div>
          <div className="flex justify-center mb-8">
            <img src="/logo.png" className="h-12" />
          </div>
          <ProfileCard />
        </div>
      </div>
    </div>
  );
}

export default function AppContainer() {
  return (
    <WagmiConfig client={client}>
      <WalletProvider>
        <App />
      </WalletProvider>
    </WagmiConfig>
  )
}
