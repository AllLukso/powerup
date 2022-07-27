import ERC725 from "@erc725/erc725.js";
import Web3 from "web3"

// Consts
const IPFS_GATEWAY = 'https://2eff.lukso.dev/ipfs/';

// Parameters for ERC725 Instance
const erc725schema = require('@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json');
const config = { ipfsGateway: IPFS_GATEWAY };

export interface ProfileOptions {

}

interface ProfileLink {
  title: string
  url: string
}

interface ProfileAvatar {
  title: string
  url: string
}

type Image = (ImageURL | ImageDigitalAsset)

interface ImageURL {
  width: number
  height: number
  hashFunction: string
  hash: string
  url: string
}

interface ImageDigitalAsset {
  address: string
  tokenId: string
}

type ProfileHandle = {
  name: string,
  tag: string,
  toString: () => string
}

export interface ProfileOptions {
  address: string;
  web3: Web3;
}

export class Profile {
  private web3: Web3

  address: string
  name: string
  description: string
  links: ProfileLink[]
  tags: string[]
  avatar: ProfileAvatar[]
  profileImage: Image[]
  backgroundImage: Image[]

  constructor(opts: ProfileOptions) {
    this.address = opts.address
    this.web3 = opts.web3
  }

  async load() {
    const erc725 = new ERC725(erc725schema, this.address, this.web3.currentProvider, config);
    const data = await erc725.fetchData('LSP3Profile') as any;
    const profileData = data.value.LSP3Profile
    this.name = profileData.name
    this.description = profileData.description
    this.links = profileData.links
    this.backgroundImage = profileData.backgroundImage
    this.profileImage = profileData.profileImage
    this.tags = profileData.tags

  }

  get handle(): ProfileHandle {
    const name = this.name
    const tag = this.address.substring(0, 4).toUpperCase()
    return {
      name,
      tag,
      toString: () => `${name}#${tag}`,
    }
  }

  async save() {
    // TODO: Save the profile metadata
  }
}
