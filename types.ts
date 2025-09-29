import type { Connection } from '@solana/web3.js';
import type { WalletContextState } from '@solana/wallet-adapter-react';

export interface MemeCoinDetails {
  name: string;
  ticker: string;
  description: string;
  imagePrompt: string;
}

export interface MemeCoin extends MemeCoinDetails {
  imageUrl: string;
}

export type TokenStandardType = 'fungible' | 'nft';

export interface DeployFnProps {
  coin: MemeCoin;
  connection: Connection;
  wallet: WalletContextState;
  onProgress: (log: string) => void;
  tokenStandard: TokenStandardType;
}