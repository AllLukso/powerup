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

export class Profile {
  name: string
  description: string
  links: ProfileLink[]
  tags: string[]
  avatar: ProfileAvatar[]
  profileImage: Image[]
  backgroundImage: Image[]

  constructor() {

  }

  async save() {
    // TODO: Save the profile metadata
  }
}
