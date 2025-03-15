"use client";

import { useAppKit, useAppKitAccount, useAppKitProvider, useWalletInfo } from "@reown/appkit/react";
import { useAppKitConnection, type Provider } from '@reown/appkit-adapter-solana/react'
import { WarpCore, HyperlaneContractsMap, MultiProvider, MultiProtocolProvider, HyperlaneCore, Token, TokenAmount, TokenStandard, WarpTypedTransaction } from "@hyperlane-xyz/sdk";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { warpCore } from "@/lib/warpcore";
import { useEffect } from "react";

export default function TestPage() {
    const { open } = useAppKit();
    const { walletInfo } = useWalletInfo();
    const { isConnected, address } = useAppKitAccount();
    const { connection } = useAppKitConnection();
    const { walletProvider } = useAppKitProvider<Provider>('solana')

    console.log("Conn:", connection)
    console.log("provider:", walletProvider)

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
                    sender: address,
                }); // 9 decimals
                console.log("FEE:", fee)
                // setInterchainTransferFee(fee.amount * BigInt(1e9));
            } catch (error) {
                console.error("Error fetching interchain transfer fee:", error);
                throw error;
            }
        }
        fetchFee();
    }, [address]);

    return (
        <div className="w-full h-full bg-red-50">
            <div className="header w-full bg-black h-[6rem] flex items-center justify-between px-[4rem]">
                <h2 className="text-white">Sonic Agents</h2>
                <div className="btns flex items-center gap-4">
                    {isConnected && <h4 className="text-white">{address}</h4>}
                    {!isConnected && <button className="px-6 py-2 rounded-md bg-green-300 text-white" onClick={()=>open()}>Connect Wallet</button>}
                    {isConnected && <button className="px-6 py-2 rounded-md bg-red-300 text-white" onClick={() => open({ view: 'Account' })}>Open Account</button>}
                </div>
            </div>

        </div>
    );
}