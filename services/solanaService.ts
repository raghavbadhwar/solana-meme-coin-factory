import { Metaplex, walletAdapterIdentity, bundlrStorage, toMetaplexFile, token } from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import type { DeployFnProps } from '../types';

// Helper to convert data URL to a buffer
async function dataUrlToBuffer(dataUrl: string): Promise<Buffer> {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

export const deployMemeCoin = async ({ coin, connection, wallet, onProgress, tokenStandard }: DeployFnProps) => {
    if (!wallet.publicKey) {
        throw new Error("Wallet not connected!");
    }

    try {
        onProgress('Setting up Metaplex...');
        const metaplex = Metaplex.make(connection)
            .use(walletAdapterIdentity(wallet))
            .use(bundlrStorage({
                address: 'https://devnet.bundlr.network',
                providerUrl: connection.rpcEndpoint,
                timeout: 60000,
            }));
        
        onProgress('Preparing image for upload...');
        const imageBuffer = await dataUrlToBuffer(coin.imageUrl);
        const metaplexFile = toMetaplexFile(imageBuffer, `${coin.ticker}-logo.png`);

        onProgress('Uploading image to Arweave...');
        const imageUrl = await metaplex.storage().upload(metaplexFile);
        console.log('Image uploaded to:', imageUrl);

        onProgress('Uploading token metadata...');
        const { uri } = await metaplex.nfts().uploadMetadata({
            name: coin.name,
            symbol: coin.ticker,
            description: coin.description,
            image: imageUrl,
        });
        console.log('Metadata uploaded to:', uri);

        const isNft = tokenStandard === 'nft';

        onProgress(isNft ? 'Creating NFT on-chain...' : 'Creating token on-chain...');
        onProgress('Please approve the transaction in your wallet.');
        
        const { mintAddress, response } = await metaplex.nfts().create({
            uri,
            name: coin.name,
            symbol: coin.ticker,
            sellerFeeBasisPoints: 0, // Typical for meme coins
            isMutable: false, // Make metadata immutable
            tokenStandard: isNft ? TokenStandard.NonFungible : TokenStandard.Fungible,
            decimals: isNft ? 0 : 9, // NFTs must have 0 decimals, meme coins use more
            creators: [{ address: wallet.publicKey, share: 100 }],
        }, {
            commitment: 'finalized',
        });
        
        console.log(`Token mint created: ${mintAddress.toBase58()}`);
        console.log(`Transaction: ${response.signature}`);

        // This block should only run for fungible tokens
        if (!isNft) {
            onProgress('Minting initial supply...');
            onProgress('Please approve the final transaction.');

            // Note: Metaplex's 'create' for Fungible tokens does not mint an initial supply.
            // A separate minting step is required.
            const { response: mintResponse } = await metaplex.tokens().mint({
                mintAddress,
                amount: token(1_000_000_000, 9), // 1 Billion tokens with 9 decimals
            }, {
                commitment: 'finalized',
            });

            console.log(`Minted 1B tokens. Transaction: ${mintResponse.signature}`);
        }


        onProgress('Deployment successful!');

        return {
            address: mintAddress.toBase58(),
            signature: response.signature,
        };
    } catch (error: any) {
        console.error("Full deployment error:", error);
        
        // Check for user rejection
        if (error.name === 'WalletSignTransactionError' || (error.message && error.message.includes('User rejected the request'))) {
            throw new Error('Transaction rejected: You cancelled the request in your wallet.');
        }

        // Check for Bundlr errors (insufficient funds)
        if (error.message && error.message.includes('Not enough funds to send data')) {
             throw new Error('Storage error: Insufficient funds in Bundlr to upload assets. This is separate from your wallet SOL.');
        }
        
        // Check for generic on-chain errors (could be insufficient SOL for gas)
        if (error.logs) {
            throw new Error('On-chain error: The transaction failed. You may not have enough SOL in your wallet for transaction fees.');
        }

        // Fallback for other errors
        throw new Error(error.message || 'An unknown deployment error occurred.');
    }
};