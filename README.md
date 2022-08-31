[![ci](https://github.com/strandgeek/powerup/actions/workflows/build.yml/badge.svg)](https://github.com/strandgeek/powerup/actions/workflows/build.yml) ![GitHub](https://img.shields.io/github/license/strandgeek/powerup) ![GitHub issues](https://img.shields.io/github/issues/strandgeek/powerup) ![GitHub last commit](https://img.shields.io/github/last-commit/strandgeek/powerup)

# PowerUP

## Quick Links
- [📹 Video Presentation](https://www.youtube.com/watch?v=3N8zNU7-wvM)
- [📕 Pitch Deck](https://drive.google.com/file/d/125elRSooWs5ichZ_PbPav3VbNJs8FoXX/view?usp=sharing)
- [🛠 Integration Example](https://github.com/strandgeek/powerup/tree/main/examples/react-app)
--------

## Table of Contents
1. [About](#about)
2. [Quick Start](#quick-start)
3. [Quick Start with ReactJS](#quick-start-with-reactjs)


--------

## About

PowerUP is a library that empowers the use of LUKSO Universal Profiles for the development of dApps. PowerUP takes care of the entire ERC-725 serialization/deserialization process, abstracting all the steps that guarantee the LUKSO standard.

In addition, PowerUP also has a powerup-react library for developing applications in React.


## Quick Start

### Install PowerUP library

```bash
npm i @strandgeek/powerup
```

### Configure the PowerUP

```tsx
import { PowerUP } from '@strandgeek/powerup'

const powerup = new PowerUP({
  provider: // Your web3 provider here,
})
```

### Get a Profile by Address

```tsx
const profile = await powerup.getProfile('0xf24C6Cc14d9e9035e30de5767DBE08A8534e8D24')
```

### Updating Profile data

```tsx
await profile.update({
  name: 'MyNewName',
  description: 'My new description',
  avatar: file, // You can use a file object from a file input here
})
```

## Quick Start with ReactJS

If you have a react dApp, you can easily integrate PowerUP with the following steps:

### Install the powerup-react

```bash
npm i @strandgeek/react-powerup
```

### Setup the Provider on your root component

```tsx
import { PowerupProvider, useWallet } from "@strandgeek/react-powerup";


export const App = () => {
  return (
    <PowerupProvider>
      <MyProfile />
    </PowerupProvider>
  )
}
```

### Connecting your Wallet

Go to the component `MyProfile` and

```tsx
  import { useWallet } from "@strandgeek/react-powerup";

  export const MyProfile = () => {
    const { isConnected, connect, profile } = useWallet();
    return (
      <div>
        {isConnected ? (
          <div>
            Connected Account: {profile.address}
          </div>
        ) : (
          <div>
            <button onClick={() => connect()}>
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    )
  }
```
