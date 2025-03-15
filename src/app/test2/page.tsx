"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { useEffect, useState } from "react";
import { WarpCore, HyperlaneContractsMap, MultiProvider, MultiProtocolProvider, HyperlaneCore, Token, TokenAmount, TokenStandard, WarpTypedTransaction } from "@hyperlane-xyz/sdk";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { warpCore } from "@/lib/warpcore";

const solanaMailbox = "E588QtVUvresuXq2KoNEwAmoifCzYGpRBdHByN9KQMbi"; // 🔥 Required for Solana messaging
const solanaCollateralAddress = "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"; // 🔥 Required for Sealevel hyp tokens

const solanaRpcUrl = "https://api.mainnet-beta.solana.com"; // "https://solana-mainnet.g.alchemy.com/v2/H-LqusqbIhSz4K9KE8vQ9i8C4PQPGD-K"
const sonicRpcUrl = "https://sonic.helius-rpc.com";

export default function TestPage2() {
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

    useEffect(() => {
        async function fetchFee() {
            try {
                const originToken = warpCore.tokens.find(
                    (token) =>
                        token.chainName === "solanamainnet" && token.symbol === "SOL",
                );
                console.log("Token:", originToken)
                if (!originToken) {
                    return;
                }
                const chains = warpCore.getTokenChains();
                console.log("Chains:", chains)
                const sonicTokens = warpCore.tokens.find(
                    (token) =>
                        token.chainName === "sonicsvm",
                );
                console.log("Sonic Tokens: ", sonicTokens)
                const fee = await warpCore.getInterchainTransferFee({
                    originToken,
                    destination: "sonicsvm",
                    sender: wallets[0].address,
                }); // 9 decimals
                console.log("FEE:", fee)
                // setInterchainTransferFee(fee.amount * BigInt(1e9));
            } catch (error) {
                console.error("Error fetching interchain transfer fee:", error);
                throw error;
            }
        }
        fetchFee();
    }, [wallets.length]);

    const bridgeToken = async () => {
        if (!wallets.length) return alert("No wallet connected!");

        const solanaWallet = wallets[0]; // Phantom wallet from Privy
        const solanaAddress = solanaWallet.address;
        const connection = new Connection(solanaRpcUrl);



        try {
            const amount = "1";
            const destination = "sonicsvm";
            const recipient = wallets[0].address;
            const originToken = warpCore.tokens[1];
            const sender = wallets[0].address;
            const parsedAmt = 0.01 * 10 ** 9; 
            const originTokenAmount = originToken.amount(parsedAmt.toString());

            console.log("Org Token:", originToken)
            console.log("Org Token Amt:", originTokenAmount)

            const fee = await warpCore.getInterchainTransferFee({
                originToken,
                destination: "sonicsvm",
                sender,
            }); // 9 decimals

            console.log("Fee:", fee)

            const txs: WarpTypedTransaction[] = await warpCore.getTransferRemoteTxs({
                originTokenAmount,
                destination,
                sender,
                recipient,
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
