import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import Web3 from "web3"
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract'
import { LinkMetdata, LSP3Profile, LSPFactory, ProfileDataBeforeUpload } from "@lukso/lsp-factory.js";
import { AssetMetadata, ImageMetadata } from "@lukso/lsp-factory.js/build/main/src/lib/interfaces/metadata";
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';

// Parameters for ERC725 Instance
import erc725schema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';

export interface ProfileOptions {
  ipfsGateway: string
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
  private currentAccount: string

  address: string
  upContract: Contract;
  ipfsGateway: string;

  constructor(opts: ProfileOptions) {
    this.address = opts.address
    this.web3 = opts.web3
    this.lspFactory = new LSPFactory(this.web3.currentProvider);
    this.upContract = new this.web3.eth.Contract(UniversalProfile.abi as AbiItem[], this.address);
    this.ipfsGateway = opts.ipfsGateway
  }

  private async getCurrentAccount(): Promise<string> {
    const accounts = await this.web3.eth.getAccounts()
    return accounts[0]
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
    const { ipfsGateway } = this
    const erc725 = new ERC725(
      erc725schema as ERC725JSONSchema[],
      this.address,
      this.web3.currentProvider,
      {
        ipfsGateway,
      }
    );
    const data = await erc725.fetchData('LSP3Profile') as any;
    this.lsp3Profile = data.value.LSP3Profile as LSP3Profile
    this.currentAccount = await this.getCurrentAccount()
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

  async update(data: UpdateProfileData) {
    const newProfileData: UpdateProfileData = { ...this.lsp3Profile }

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
      ipfsGateway: this.ipfsGateway,
    });

    const encodedData = erc725.encodeData([{
      keyName: "LSP3Profile",
      value: {
        hashFunction: "keccak256(utf8)",
        hash: this.web3.utils.keccak256(JSON.stringify(uploadResult.json)),
        url: lsp3ProfileIPFSUrl,
      },
    }]);

    const universalProfileContract = new this.web3.eth.Contract(UniversalProfile.abi as AbiItem[], this.address);
    await universalProfileContract.methods
    ["setData(bytes32,bytes)"](encodedData.keys[0], encodedData.values[0])
      .send({
        from: this.currentAccount,
      })
  }
}
