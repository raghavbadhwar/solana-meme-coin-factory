import React, { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { generateMemeCoinDetails, generateMemeCoinImage } from './services/geminiService';
import { deployMemeCoin } from './services/solanaService';
import type { MemeCoin, TokenStandardType } from './types';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import CoinDetailsCard from './components/CoinDetailsCard';
import DeploymentStatus from './components/DeploymentStatus';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedCoin, setGeneratedCoin] = useState<MemeCoin | null>(null);
  const [tokenStandard, setTokenStandard] = useState<TokenStandardType>('fungible');

  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [deploymentResult, setDeploymentResult] = useState<{ address: string; explorerUrl: string } | null>(null);

  const { connection } = useConnection();
  const wallet = useWallet();

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for your meme coin.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedCoin(null);
    setDeploymentResult(null);
    setDeploymentLogs([]);

    try {
      setLoadingMessage('Crafting your meme coin concept...');
      const details = await generateMemeCoinDetails(prompt);

      setLoadingMessage('Bringing your mascot to life...');
      const imageData = await generateMemeCoinImage(details.imagePrompt);
      const imageUrl = `data:image/png;base64,${imageData}`;

      setGeneratedCoin({ ...details, imageUrl });
    } catch (err) {
      console.error(err);
      setError('Failed to generate meme coin. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [prompt]);

  const handleDeploy = useCallback(async () => {
    if (!generatedCoin) return;
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError("Wallet not connected or doesn't support signing.");
      return;
    }

    setIsDeploying(true);
    setDeploymentLogs([]);
    setDeploymentResult(null);
    setError(null);

    const onProgress = (log: string) => {
      setDeploymentLogs(prev => [...prev, log]);
    };

    try {
      const { address } = await deployMemeCoin({
        coin: generatedCoin,
        connection,
        wallet,
        onProgress,
        tokenStandard
      });

      setDeploymentResult({
        address,
        explorerUrl: `https://explorer.solana.com/address/${address}?cluster=devnet`
      });
    } catch (err: any) {
      console.error("Deployment failed", err);
      setError(err.message || 'An unknown error occurred during deployment.');
      onProgress(`Error: ${err.message || 'Deployment failed.'}`);
    } finally {
      setIsDeploying(false);
    }
  }, [generatedCoin, connection, wallet, tokenStandard]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <p className="text-center text-lg text-gray-400 mb-6">
            Describe your wildest meme coin idea. Our AI will handle the rest, from creation to a real Solana Devnet launch.
          </p>
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {isLoading && <Loader message={loadingMessage} />}

          {!isLoading && generatedCoin && (
            <div className="mt-12 animate-fade-in">
              <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Your Creation is Ready!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <CoinDetailsCard coin={generatedCoin} />
                <DeploymentStatus
                  walletConnected={!!wallet.publicKey}
                  isDeploying={isDeploying}
                  logs={deploymentLogs}
                  result={deploymentResult}
                  onDeploy={handleDeploy}
                  tokenStandard={tokenStandard}
                  setTokenStandard={setTokenStandard}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;