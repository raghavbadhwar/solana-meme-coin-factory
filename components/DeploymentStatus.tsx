import React from 'react';
import { SolanaIcon } from './icons/SolanaIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import Loader from './Loader';
import type { TokenStandardType } from '../types';

interface DeploymentStatusProps {
  walletConnected: boolean;
  isDeploying: boolean;
  logs: string[];
  result: { address: string; explorerUrl: string } | null;
  onDeploy: () => void;
  tokenStandard: TokenStandardType;
  setTokenStandard: (standard: TokenStandardType) => void;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ walletConnected, isDeploying, logs, result, onDeploy, tokenStandard, setTokenStandard }) => {
  const canDeploy = walletConnected && !isDeploying;

  const getButtonText = () => {
    if (tokenStandard === 'nft') {
      return 'Mint as NFT';
    }
    return 'Deploy Meme Coin';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl shadow-2xl flex flex-col h-full min-h-[350px]">
      <h3 className="text-2xl font-bold mb-4 text-center">Deployment on Solana</h3>
      
      {!isDeploying && !result && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <p className="text-gray-400 mb-4 text-center">
            {walletConnected 
              ? "Choose your token type and deploy to the Solana Devnet." 
              : "Please connect your wallet to continue."}
          </p>
          
          <div className="flex bg-gray-900/70 p-1 rounded-lg mb-6">
            <button
              onClick={() => setTokenStandard('fungible')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors w-32 ${
                tokenStandard === 'fungible' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'
              }`}
              disabled={!walletConnected}
            >
              Meme Coin
            </button>
            <button
              onClick={() => setTokenStandard('nft')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors w-32 ${
                tokenStandard === 'nft' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'
              }`}
              disabled={!walletConnected}
            >
              NFT (1 of 1)
            </button>
          </div>

          <button
            onClick={onDeploy}
            disabled={!canDeploy}
            className="flex items-center justify-center gap-3 w-full max-w-xs px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-gray-900 font-bold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <SolanaIcon className="w-6 h-6" />
            {getButtonText()}
          </button>
        </div>
      )}

      {isDeploying && (
        <div className="space-y-2 mt-4 flex-grow overflow-y-auto max-h-64 pr-2">
          {logs.map((log, index) => (
            <p key={index} className="text-sm text-gray-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <span className="text-green-400 mr-2">✓</span> {log}
            </p>
          ))}
           <div className="pt-4"><Loader message="Processing transaction..." small /></div>
        </div>
      )}

      {result && (
        <div className="mt-4 text-center flex flex-col items-center justify-center flex-grow animate-fade-in">
          <CheckCircleIcon className="w-16 h-16 text-green-400 mb-4" />
          <h4 className="text-xl font-semibold text-green-300">Deployment Successful!</h4>
          <p className="text-gray-400 mt-2">
            {tokenStandard === 'nft' ? 'Your NFT is now' : 'Your meme coin is now'} live on the Solana Devnet.
          </p>
          <div className="mt-4 bg-gray-900 p-3 rounded-lg w-full">
            <label className="text-xs text-gray-500">Token Mint Address</label>
            <p className="text-sm font-mono break-all">{result.address}</p>
          </div>
          <a
            href={result.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-400 hover:text-blue-300 underline"
          >
            View on Solana Explorer
          </a>
        </div>
      )}
    </div>
  );
};

export default DeploymentStatus;