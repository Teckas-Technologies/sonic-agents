"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { useEffect, useState } from "react";
import { WarpCore, HyperlaneContractsMap, MultiProvider, MultiProtocolProvider, HyperlaneCore, Token, TokenAmount, TokenStandard, WarpTypedTransaction } from "@hyperlane-xyz/sdk";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

const solanaMailbox = "E588QtVUvresuXq2KoNEwAmoifCzYGpRBdHByN9KQMbi"; // 🔥 Required for Solana messaging
const solanaCollateralAddress = "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"; // 🔥 Required for Sealevel hyp tokens

const solanaRpcUrl ="https://solana-mainnet.g.alchemy.com/v2/H-LqusqbIhSz4K9KE8vQ9i8C4PQPGD-K" // "https://api.mainnet-beta.solana.com";
const sonicRpcUrl = "https://sonic.helius-rpc.com";

export default function TestPage() {
    const { connectWallet, user, ready } = usePrivy();
    const [isConnected, setIsConnected] = useState(false);

    const { wallets } = useSolanaWallets();

    console.log("Wallets:", wallets[0])
    console.log("User:", user)

    const check = async () => {
        setIsConnected(await wallets[0].isConnected())
    }

    useEffect(() => {
        if (wallets.length > 0) {
            check();
        }
    }, [wallets.length])

    const checkLinked = async () => {
        if (wallets.length === 0) {
            return;
        }
        const linked = await wallets[0].linked;
        console.log("Linked: ", linked);
        if (!linked) {
            const res = await wallets[0].loginOrLink();
            console.log("RES:", res)
        }
    }

    useEffect(() => {
        if (wallets.length > 0) {
            checkLinked()
        }
    }, [wallets.length])

    const handleDisconnect = async () => {
        if (wallets.length === 0) {
            return;
        }
        setIsConnected(false);
        await wallets[0].disconnect();
    }

    const bridgeToken = async () => {
        if (!wallets.length) return alert("No wallet connected!");

        const solanaWallet = wallets[0]; // Phantom wallet from Privy
        const solanaAddress = solanaWallet.address;
        const recipientEvmAddress = "0xRecipientEvmAddressOnSonic"; // Replace with the correct EVM address

        const connection = new Connection(solanaRpcUrl);
        const multiProvider = new MultiProtocolProvider<{ mailbox?: string }>({
            solana: {
                name: "solana",
                chainId: 101,
                domainId: 101, // Solana domain ID
                protocol: "sealevel" as 'ethereum' | 'sealevel' | 'cosmos' | any,
                rpcUrls: [{ http: solanaRpcUrl }],
                blockExplorers: [
                    // {
                    //     name: "Solana Explorer",
                    //     url: "https://explorer.solana.com",
                    //     // apiUrl: "https://api.mainnet-beta.solana.com",
                    // }
                ],
                nativeToken: {
                    name: "Solana",
                    symbol: "SOL",
                    decimals: 9,
                },
                mailbox: solanaMailbox
            },
            sonic: {
                name: "sonic",
                chainId: 507150715,
                domainId: 507150715,
                protocol: "ethereum" as 'ethereum' | 'sealevel' | 'cosmos' | any,
                rpcUrls: [{ http: sonicRpcUrl }],
                blockExplorers: [
                    {
                        name: "Sonic Explorer",
                        url: "https://explorer.sonic.game",
                        apiUrl: "https://api.sonic-explorer.com",
                    }
                ],
                nativeToken: {
                    name: "Sonic SVM (SONIC)",
                    symbol: "SONIC",
                    decimals: 9,
                },
            },
        });

        const warpCore = new WarpCore(multiProvider, []);

        const originToken = warpCore.tokens.find(
            (token) =>
              token.chainName === "eclipsemainnet" && token.symbol === "tETH",
          );
        console.log("TOKENS:", originToken)

        try {
            const solanaToken = new Token({
                name: "Solana", // ✅ Required property
                symbol: "SOL",
                decimals: 9,
                chainName: "solana",
                addressOrDenom: "So11111111111111111111111111111111111111112" , // "So11111111111111111111111111111111111111112", // Native SOL
                standard: TokenStandard.SealevelHypNative // ✅ Correct TokenStandard
            });

            // ✅ Correctly instantiate TokenAmount instead of using a raw object
            const originTokenAmount = new TokenAmount(0.1 * 10 ** 9, solanaToken);

            const txs: WarpTypedTransaction[] = await warpCore.getTransferRemoteTxs({
                originTokenAmount: originTokenAmount,
                destination: "sonic",
                sender: solanaAddress,
                recipient: solanaAddress,
            });

            console.log("Transactions to Sign:", txs);

            for (const tx of txs) {
                // ✅ Ensure the transaction is a valid Solana transaction before adding it
                if (tx.transaction instanceof TransactionInstruction || tx.transaction instanceof Transaction) {
                    const solanaTransaction = new Transaction().add(tx.transaction);
                    solanaTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
                    solanaTransaction.feePayer = new PublicKey(solanaAddress);

                    // ✅ Sign & Send Transaction using Phantom Wallet
                    const signedTx = await solanaWallet.signTransaction(solanaTransaction);
                    const txId = await connection.sendRawTransaction(signedTx.serialize());
                    console.log(`Transaction Sent: https://explorer.solana.com/tx/${txId}`);
                } else {
                    console.warn("Skipping non-Solana transaction:", tx.transaction);
                }
            }

            alert("Token bridging to Sonic initiated!");
        } catch (error) {
            console.error("Bridging failed:", error);
            alert("Failed to bridge tokens. Check console.");
        }
    };

    return (
        <div className="w-full h-full bg-red-50">
            <div className="header w-full bg-black h-[6rem] flex items-center justify-between px-[4rem]">
                <h2 className="text-white">Sonic Agents</h2>
                <div className="btns flex items-center gap-4">
                    {isConnected && <h4 className="text-white">{wallets[0].address}</h4>}
                    {!isConnected && <button className="px-6 py-2 rounded-md bg-green-300 text-white" onClick={connectWallet}>Connect Wallet</button>}
                    {isConnected && <button className="px-6 py-2 rounded-md bg-red-300 text-white" onClick={handleDisconnect}>Disconnect</button>}
                </div>
            </div>

            <div className="main w-full h-full p-6">
                <button onClick={bridgeToken} className="px-6 py-2 rounded-md bg-blue-500 text-white">
                    Bridge 0.1 SOL to Sonic
                </button>
            </div>
        </div>
    );
}
