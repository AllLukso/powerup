import React, { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/solid";
import { ProfileCard } from "./components/ProfileCard";
import { Profile } from '@strandgeek/powerup'
import { usePowerUP } from "./hooks/usePowerUP";

function App() {
  const powerUP = usePowerUP()
  const [profile, setProfile] = useState<Profile>()
  useEffect(() => {
    powerUP.getProfile('0x7f2e0d0d5345E87ae7195510A74cC1c21dBF646b').then(setProfile)
  }, [])
  if (!profile) {
    return null
  }
  return (
    <div className="bg-base-200 w-full h-full">
      <div className="flex items-center justify-center w-screen h-screen">
        <div>
          <div className="flex justify-center mb-8">
            <img src="/logo.png" className="h-12" />
          </div>
          <ProfileCard profile={profile} />
        </div>
      </div>
    </div>
  );
}

export default App;
