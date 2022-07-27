import { Profile } from "./profile"
import Web3 from "web3"

export interface PowerUPOptions {
  web3: Web3
}

export class PowerUP {
  web3: Web3;
  constructor(opts: PowerUPOptions) {
    this.web3 = opts.web3;
  }

  async getProfile(address: string): Promise<Profile> {
    const profile = new Profile({
      web3: this.web3,
      address,
    })
    await profile.load()
    return profile
  }
}
