import { PencilIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { WagmiConfig, createClient, configureChains, defaultChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { ProfileCard } from "./components/ProfileCard";
import { ProfileForm } from './components/ProfileForm';
import { useWallet, WalletProvider } from "./providers/wallet";

const { provider } = configureChains(defaultChains, [publicProvider()])

const client = createClient({
  autoConnect: true,
  provider,
})

function App() {
  const { isConnected, connect, address } = useWallet()
  const [isEditing, setIsEditing] = useState<boolean>(false)

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
            {/* <img src="/logo.png" className="h-12" /> */}
          </div>
          {isEditing ? (
            <ProfileForm />
          ): (
            <div>
              <ProfileCard />
              <button className="btn btn-primary btn-ghost btn-block mt-8" onClick={() => setIsEditing(true)}>
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
            </div>
          )}
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
