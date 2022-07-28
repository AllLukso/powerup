import { useEffect, useState } from "react"
import { useWallet } from "../providers/wallet"
import { Profile } from "@strandgeek/powerup";
import { usePowerUP } from "./usePowerUP";

export const useProfile = (): Profile | null => {
  const { address, provider } = useWallet()
  const [profile, setProfile] = useState<Profile | null>(null)
  const powerUP = usePowerUP({ provider })
  useEffect(() => {
    if (address) {
      powerUP.getProfile(address).then(profile => setProfile(profile))
    }
  }, [address, provider])
  return profile
}
