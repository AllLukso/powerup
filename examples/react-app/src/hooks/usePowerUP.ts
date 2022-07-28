import { PowerUP } from '@strandgeek/powerup'
import { provider } from 'web3-core';


interface UsePowerUPOptions {
  provider: provider
}

export const usePowerUP = ({ provider }: UsePowerUPOptions): PowerUP => {
  const powerUP = new PowerUP({
    provider,
  })
  return powerUP
}
