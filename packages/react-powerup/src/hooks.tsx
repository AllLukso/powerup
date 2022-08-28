import { PowerUP, Profile } from "@strandgeek/powerup";
import { useContext } from "react";
import { WalletContext, walletContext } from "./context";

export const useWallet = (): WalletContext => {
  return useContext(walletContext)
}

export const usePowerUP = (): PowerUP | null => {
  const ctx = useContext(walletContext)
  return ctx.powerup
}

export const useCurrentProfile = (): Profile | null => {
  const ctx = useContext(walletContext)
  return ctx.profile
}
