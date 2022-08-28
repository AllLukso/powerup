import { Profile } from "./profile"
import { provider } from "web3-core"
import Web3 from "web3";

const DEFAULT_IPFS_GATEWAY = 'https://2eff.lukso.dev/ipfs/'

export interface PowerUPOptions {
  provider: provider
  ipfsGateway?: string
}

export class PowerUP {
  web3: Web3
  provider: provider;
  ipfsGateway: string;
  constructor(opts: PowerUPOptions) {
    this.provider = opts.provider;
    this.web3 = new Web3(this.provider)
    this.ipfsGateway = opts.ipfsGateway || DEFAULT_IPFS_GATEWAY
  }

  async getProfile(address: string): Promise<Profile> {
    const profile = new Profile({
      web3: this.web3,
      ipfsGateway: this.ipfsGateway,
      address,
    })
    await profile.load()
    return profile
  }
}
