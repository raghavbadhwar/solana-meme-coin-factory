
import React from 'react';
import type { MemeCoin } from '../types';

interface CoinDetailsCardProps {
  coin: MemeCoin;
}

const CoinDetailsCard: React.FC<CoinDetailsCardProps> = ({ coin }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl shadow-2xl flex flex-col items-center text-center h-full">
      <div className="w-40 h-40 mb-4 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center border-4 border-purple-500">
        <img src={coin.imageUrl} alt={`${coin.name} logo`} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-3xl font-bold text-white">{coin.name}</h3>
      <p className="mt-1 text-xl font-mono text-green-400 bg-gray-900 px-3 py-1 rounded">
        ${coin.ticker}
      </p>
      <p className="mt-4 text-gray-300 leading-relaxed">
        {coin.description}
      </p>
    </div>
  );
};

export default CoinDetailsCard;
