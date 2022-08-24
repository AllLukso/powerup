import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import Web3 from "web3"
import { LinkMetdata, LSP3Profile, LSPFactory, ProfileDataBeforeUpload } from "@lukso/lsp-factory.js";
import { AssetMetadata, ImageMetadata } from "@lukso/lsp-factory.js/build/main/src/lib/interfaces/metadata";
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
  hashFunction: string
  hash: string
  fileType: string
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
  width: number
  height: number
  hashFunction: string
  hash: string
  url: string
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

export type UpdateProfileData = ProfileDataBeforeUpload

export class Profile {
  private web3: Web3
  private lspFactory: LSPFactory
  private lsp3Profile: LSP3Profile

  address: string

  constructor(opts: ProfileOptions) {
    this.address = opts.address
    this.web3 = opts.web3
    this.lspFactory = new LSPFactory(this.web3.currentProvider);
  }

  get name(): string {
    return this.lsp3Profile.name
  }

  get description(): string {
    return this.lsp3Profile.description
  }

  get links(): LinkMetdata[] {
    return this.lsp3Profile.links
  }

  get tags(): string[] {
    return this.lsp3Profile.tags
  }

  get avatar(): AssetMetadata[] {
    return this.lsp3Profile.avatar
  }

  get profileImage(): ImageMetadata[] {
    return this.lsp3Profile.profileImage
  }

  get backgroundImage(): ImageMetadata[] {
    return this.lsp3Profile.backgroundImage
  }


  async load() {
    const erc725 = new ERC725(erc725schema, this.address, this.web3.currentProvider, config);
    const data = await erc725.fetchData('LSP3Profile') as any;
    this.lsp3Profile = data.value.LSP3Profile as LSP3Profile
    // console.log(profileData)
    // this.name = profileData.name
    // this.description = profileData.description
    // this.links = profileData.links
    // this.backgroundImage = profileData.backgroundImage
    // this.profileImage = profileData.profileImage
    // this.tags = profileData.tags

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

  // private async _getCurrentProfileUploaddData(): Promise<{ LSP3Profile: ProfileDataBeforeUpload }> {
  //   return {
  //     LSP3Profile: {
  //       name: this.name,
  //       description: this.description,
  //       avatar: this.avatar,
  //       backgroundImage: this.backgroundImage,
  //     }
  //   }
  // }

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

  async update(data: UpdateProfileData) {
    const newProfileData: UpdateProfileData  = { ...this.lsp3Profile }

    if (data.name) {
      newProfileData.name = data.name
    }

    if (data.description) {
      newProfileData.description = data.description
    }

    if (data.links) {
      newProfileData.links = data.links
    }

    if (data.avatar) {
      newProfileData.avatar = data.avatar
    }

    if (data.backgroundImage) {
      newProfileData.backgroundImage = data.backgroundImage
    }

    if (data.profileImage) {
      newProfileData.profileImage = data.profileImage
    }

    if (data.tags) {
      newProfileData.tags = data.tags
    }

    const uploadData = {
      LSP3Profile: newProfileData
    }

    const uploadResult = await this.lspFactory.UniversalProfile.uploadProfileData(uploadData.LSP3Profile);
    const lsp3ProfileIPFSUrl = uploadResult.url;

    const schema: ERC725JSONSchema[] = [
      {
        name: "LSP3Profile",
        key: "0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5",
        keyType: "Singleton",
        valueContent: "JSONURL",
        valueType: "bytes",
      },
    ];

    const erc725 = new ERC725(schema, this.address, this.web3.currentProvider, {
      ipfsGateway: "https://cloudflare-ipfs.com/ipfs/",
    });

    const encodedData = erc725.encodeData({
      // TODO: Fix the type issue here
      // @ts-ignore
      keyName: "LSP3Profile",
      value: {
        hashFunction: "keccak256(utf8)",
        // hash our LSP3 metadata JSON file
        hash: this.web3.utils.keccak256(JSON.stringify(uploadResult.json)),
        url: lsp3ProfileIPFSUrl,
      },
    });

    const universalProfileContract = new this.web3.eth.Contract(UniversalProfile.abi, this.address);
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
