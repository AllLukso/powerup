import { Profile } from "./profile"
import { provider } from "web3-core"
import Web3 from "web3";

export interface PowerUPOptions {
  provider: provider
}

export class PowerUP {
  web3: Web3
  provider: provider;
  constructor(opts: PowerUPOptions) {
    this.provider = opts.provider;
    this.web3 = new Web3(this.provider)
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
