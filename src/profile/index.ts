import ERC725 from "@erc725/erc725.js";
import Web3 from "web3"
import { LSPFactory, ProfileDataBeforeUpload } from "@lukso/lsp-factory.js";
const UniversalProfile = require('@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json');
const KeyManager = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");




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
  private lspFactory: LSPFactory

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
    this.lspFactory = new LSPFactory(this.web3.currentProvider);
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

  async generateUploadData(): Promise<{ LSP3Profile: ProfileDataBeforeUpload }> {
    return {
      LSP3Profile: {
        name: this.name,
        description: this.description,
        avatar: [],
        backgroundImage: [],
        profileImage: [],
        links: [],
        tags: [],
      }
    }
  }

  async save() {
    const data = await this.generateUploadData()
    const uploadResult = await this.lspFactory.UniversalProfile.uploadProfileData(data.LSP3Profile);
    const lsp3ProfileIPFSUrl = uploadResult.url;

    const schema = [
      {
        name: "LSP3Profile",
        key: "0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5",
        keyType: "Singleton",
        valueContent: "JSONURL",
        valueType: "bytes",
      },
    ] as any;

    const erc725 = new ERC725(schema, this.address, this.web3.currentProvider, {
      ipfsGateway: "https://cloudflare-ipfs.com/ipfs/",
    });

    const encodedData = erc725.encodeData({
      // @ts-ignore
      keyName: "LSP3Profile",
      value: {
        hashFunction: "keccak256(utf8)",
        // hash our LSP3 metadata JSON file
        hash: this.web3.utils.keccak256(JSON.stringify(data)),
        url: lsp3ProfileIPFSUrl,
      },
    });

    const universalProfileContract = new this.web3.eth.Contract(UniversalProfile.abi, this.address);
    console.log(universalProfileContract.methods)
    await universalProfileContract.methods
    ["setData(bytes32,bytes)"](encodedData.keys[0], encodedData.values[0])
      .send({
        from: this.address,
      })
      .on("receipt", (receipt) => {
        console.log(receipt)
      })
      .once("sending", (payload) => {
        console.log(payload)
      })
  }
}
