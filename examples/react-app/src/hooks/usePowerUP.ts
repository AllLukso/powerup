import { PowerUP } from '@strandgeek/powerup'
import Web3 from 'web3';

const RPC_ENDPOINT = 'https://rpc.l16.lukso.network';

const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT)
const web3 = new Web3(provider)


export const usePowerUP = (): PowerUP => {
  const powerUP = new PowerUP({
    web3,
  })
  return powerUP
}
