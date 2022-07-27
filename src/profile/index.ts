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

export class Profile {
  address: string
  name: string
  description: string
  links: ProfileLink[]
  tags: string[]
  avatar: ProfileAvatar[]
  profileImage: Image[]
  backgroundImage: Image[]

  constructor(address: string) {
    this.address = address
  }

  async load() {
    // TODO: Fetch profile real data
    this.name = 'StrandGeek'
    this.description = 'Hello World'
    this.tags = ['Blockchain', 'Development', 'Web3', 'Technology']
    
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
