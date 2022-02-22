import { CreatedKeyPair } from './CreatedKeyPair.type';

export type CreatedAddress = {
  address: string;
} & CreatedKeyPair;
