import React from 'react';
import { SolanaIcon } from './icons/SolanaIcon';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <SolanaIcon className="w-12 h-12" />
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
          Solana Meme Coin Factory
        </h1>
      </div>
      <WalletMultiButton />
    </header>
  );
};

export default Header;
