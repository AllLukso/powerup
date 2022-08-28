import { PowerupProvider, useWallet } from "@strandgeek/react-powerup";
import ClipLoader from "react-spinners/ClipLoader";
import { MyProfile } from "./components/MyProfile";

function App() {
  const { isConnected, connect, loading } = useWallet();
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {loading && <ClipLoader />}
      {isConnected ? (
        <MyProfile />
      ) : (
        <div className="flex flex-col justify-center">
          <button className="btn btn-primary" onClick={() => connect()}>
            Connect Wallet
          </button>
          <div className="text-center mt-4 text-sm opacity-50">
            Please, make sure you have the UP Browser Extension Installed
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppContainer() {
  return (
    <PowerupProvider>
      <App />
    </PowerupProvider>
  );
}
