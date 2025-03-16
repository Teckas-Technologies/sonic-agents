/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRobot, FaLaptopCode } from "react-icons/fa6";
import { MdLink } from "react-icons/md";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { useBridgeToken } from "@/hooks/useBridge";

export default function Navbar({
  isCollapsed,
  isMobileNavVisible,
  onMobileNavToggle,
}: {
  isCollapsed: boolean;
  isMobileNavVisible: boolean;
  onMobileNavToggle: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { connectWallet, user, ready } = usePrivy();
  const [isConnected, setIsConnected] = useState(false);

  const { wallets } = useSolanaWallets();

  const checkConnection = async () => {
    setIsConnected(await wallets[0].isConnected())
  }

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
      checkConnection();
    }
  }, [wallets.length])

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

  // Determine active tab based on current route
  const getActiveTab = () => {
    if (pathname === "/browse") return "Browse Agents";
    return "Chat"; // Default active tab
  };

  const [active, setActive] = useState(getActiveTab);

  useEffect(() => {
    setActive(getActiveTab()); // Update state when route changes
  }, [pathname]);

  const handleNavigation = (page: string) => {
    setActive(page);
    router.push(page === "Browse Agents" ? "/browse" : "/");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileNavVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-30 md:hidden"
          onClick={onMobileNavToggle}
        />

      )}

      <nav
        className={`fixed md:relative h-screen bg-black bg-opacity-90 text-white p-4 flex-col justify-between border-r border-gray-700 transition-all ${isCollapsed && !isMobileNavVisible ? "w-20" : "w-64"
          } ${isMobileNavVisible ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 z-50`}
      >

        <div className="flex flex-col h-full">
          {/* Logo and Menu Items */}
          <div>
            {/* Logo */}
            <div className="flex items-center space-x-2 font-semibold">
              <img src="images/sonic-logo.png" className="h-9" />
              {(!isCollapsed || isMobileNavVisible) && (
                <span
                  className="text-white text-2xl"
                  style={{ fontFamily: "orbitron" }}
                >
                  SONIC
                </span>
              )}
            </div>

            {/* Menu Items */}
            <ul className="mt-6 space-y-2" style={{ fontFamily: "manrope" }}>
              <li>
                <button
                  className={`flex cursor-pointer items-center w-full gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${active === "Chat" ? "bg-gray-700" : "hover:bg-gray-800"
                    }`}
                  onClick={() => handleNavigation("Chat")}
                >
                  <FaLaptopCode className="w-8 h-8" />
                  {(!isCollapsed || isMobileNavVisible) && (
                    <span className="text-base font-semibold">Chat</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  className={`flex cursor-pointer items-center w-full px-3 gap-2 py-2 rounded-lg text-sm transition-colors ${active === "Browse Agents"
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
                    }`}
                  onClick={() => handleNavigation("Browse Agents")}
                >
                  <FaRobot className="w-8 h-8" />
                  {(!isCollapsed || isMobileNavVisible) && (
                    <span className="text-base font-semibold">Browse Agents</span>
                  )}
                </button>
              </li>
            </ul>
            <hr className="mt-5 h-3"></hr>
            {(!isCollapsed || isMobileNavVisible) && (
              <div className="mt-4 space-y-4">
                <Link
                  href="#"
                  className="block text-gray-400 text-lg flex flex-row items-center gap-1 font-semibold hover:bg-gray-800 px-3 py-2 rounded-lg"
                  style={{ fontFamily: "manrope" }}
                >
                  Build Agent <HiMiniArrowUpRight />
                </Link>
                <Link
                  href="#"
                  className="block flex flex-row items-center gap-1 text-gray-400 text-lg font-semibold hover:bg-gray-800 px-3 py-2 rounded-lg"
                  style={{ fontFamily: "manrope" }}
                >
                  Documentation <HiMiniArrowUpRight />
                </Link>
              </div>
            )}
          </div>

          {/* Connect Wallet Button */}
          <div className="mt-auto">
            <button
              className="w-full py-2 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-sm bg-white text-black font-bold hover:bg-gray-200 transition"
              style={{ fontFamily: "manrope" }}
              onClick={() => !isConnected ? connectWallet() : handleDisconnect()}
            >
              <MdLink className="w-8 h-8" />
              {(!isCollapsed || isMobileNavVisible) && (
                !isConnected ? <span>Connect Wallet</span> : <span>Disconnect</span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}