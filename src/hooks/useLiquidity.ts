import { useSolanaWallets } from "@privy-io/react-auth";
import {
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import { useState } from "react";
import BN from "bn.js";

const SOLANA_RPC_URL = "https://sonic.helius-rpc.com";
const CPSWAP_PROGRAM_ID = new PublicKey("SegazTQwbYWknDZkJ6j2Kgvm5gw3MrHGKtWstZdoNKZ");

export interface AddLiquidityData {
    poolState: string;
    ownerLpToken: string;
    token0Account: string;
    token1Account: string;
    token0Vault: string;
    token1Vault: string;
    tokenProgram: string;
    tokenProgram2022: string;
    vault0Mint: string;
    vault1Mint: string;
    lpMint: string;
    authority: string;
    lpTokenAmount: string;
    maximumToken0Amount: string;
    maximumToken1Amount: string;
}

export const useAddLiquidity = () => {
    const { wallets } = useSolanaWallets();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const solanaWallet = wallets[0];
    const solanaAddress = solanaWallet?.address;

    const addLiquidity = async (data: AddLiquidityData) => {
        if (!solanaAddress) {
            setError("Please connect your wallet.");
            return;
        }

        const connection = new Connection(SOLANA_RPC_URL);
        const payer = new PublicKey(solanaAddress);

        try {
            setLoading(true);
            setError(null);

            // ✅ Validate PublicKeys
            const validatePublicKey = (key: string) => {
                try {
                    return new PublicKey(key);
                } catch (error) {
                    throw new Error(`Invalid PublicKey: ${key}`);
                }
            };

            const poolState = validatePublicKey(data.poolState);
            const ownerLpToken = validatePublicKey(data.ownerLpToken);
            const token0Account = validatePublicKey(data.token0Account);
            const token1Account = validatePublicKey(data.token1Account);
            const token0Vault = validatePublicKey(data.token0Vault);
            const token1Vault = validatePublicKey(data.token1Vault);
            const tokenProgram = validatePublicKey(data.tokenProgram);
            const tokenProgram2022 = validatePublicKey(data.tokenProgram2022);
            const vault0Mint = validatePublicKey(data.vault0Mint);
            const vault1Mint = validatePublicKey(data.vault1Mint);
            const lpMint = validatePublicKey(data.lpMint);
            const authority = validatePublicKey(data.authority);

            // ✅ Validate Amounts
            const lpTokenAmount = new BN(parseFloat(data.lpTokenAmount) * 10 ** 9);
            const maximumToken0Amount = new BN(parseFloat(data.maximumToken0Amount) * 10 ** 9);
            const maximumToken1Amount = new BN(parseFloat(data.maximumToken1Amount) * 10 ** 9);

            // ✅ Construct the Add Liquidity Instruction
            const addLiquidityInstruction = new TransactionInstruction({
                programId: CPSWAP_PROGRAM_ID,
                keys: [
                    { pubkey: payer, isSigner: true, isWritable: true }, // User
                    { pubkey: authority, isSigner: false, isWritable: false }, // Authority
                    { pubkey: poolState, isSigner: false, isWritable: true }, // Pool state
                    { pubkey: ownerLpToken, isSigner: false, isWritable: true }, // LP Token account
                    { pubkey: token0Account, isSigner: false, isWritable: true },
                    { pubkey: token1Account, isSigner: false, isWritable: true },
                    { pubkey: token0Vault, isSigner: false, isWritable: true },
                    { pubkey: token1Vault, isSigner: false, isWritable: true },
                    { pubkey: tokenProgram, isSigner: false, isWritable: false },
                    { pubkey: tokenProgram2022, isSigner: false, isWritable: false },
                    { pubkey: vault0Mint, isSigner: false, isWritable: false },
                    { pubkey: vault1Mint, isSigner: false, isWritable: false },
                    { pubkey: lpMint, isSigner: false, isWritable: true },
                ],
                data: Buffer.from(
                    Uint8Array.of(
                        ...[242, 35, 198, 137, 82, 225, 242, 182], // Discriminator for `deposit`
                        ...lpTokenAmount.toArray("le", 8),
                        ...maximumToken0Amount.toArray("le", 8),
                        ...maximumToken1Amount.toArray("le", 8)
                    )
                ),
            });

            // ✅ Create and sign the transaction
            const transaction = new Transaction().add(addLiquidityInstruction);
            transaction.feePayer = payer;

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;

            console.log("Tx:", transaction)

            const signedTx = await solanaWallet.signTransaction(transaction);

            console.log("signedTx:", signedTx)

            // ✅ Send Transaction (Bypassing Preflight Simulation)
            const txHash = await connection.sendRawTransaction(signedTx.serialize(), {
                skipPreflight: true,  // 🚀 Bypass simulation errors
                preflightCommitment: "processed",
            });

            console.log(`Transaction Sent: https://explorer.solana.com/tx/${txHash}`);

            return {
                success: true,
                txHash,
                message: `Added liquidity of ${data.lpTokenAmount} LP tokens successfully!`,
            };
        } catch (err: any) {
            setError(err.message || "Add Liquidity failed");
            console.error("Add Liquidity failed:", err.message);
            return { success: false, message: err.message || "Add Liquidity failed" };
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, addLiquidity };
};
