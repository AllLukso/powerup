import { Profile } from "./profile"

export interface PowerUPOptions {

}

class PowerUP {
  constructor(opts: PowerUPOptions) {

  }

  async getProfile(address: string): Promise<Profile> {
    // TODO: Load profile here
    return new Profile()
  }
}
