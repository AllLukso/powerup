import React, { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/solid";
import { ProfileCard } from "./components/ProfileCard";
import { Profile } from '@strandgeek/powerup'
import { usePowerUP } from "./hooks/usePowerUP";

function App() {
  const powerUP = usePowerUP()
  const [profile, setProfile] = useState<Profile>()
  useEffect(() => {
    powerUP.getProfile('ahb7n').then(setProfile)
  }, [powerUP])
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
