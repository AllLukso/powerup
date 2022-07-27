import { Profile } from "./profile"

export interface PowerUPOptions {

}

export class PowerUP {
  constructor(opts: PowerUPOptions) {

  }

  async getProfile(address: string): Promise<Profile> {
    const profile = new Profile(address)
    await profile.load()
    return profile
  }
}
