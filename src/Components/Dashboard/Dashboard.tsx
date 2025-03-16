"use client";
import { useState } from "react";
import InlineSVG from "react-inlinesvg";
import { BiUpArrowAlt } from "react-icons/bi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import AgentsModal from "../AgentsModal/AgentsModal";

const agents = [
  {
    name: "Delta Trade DCA Helper",
    description: "Agent description here...",
    logo: "images/sonic-logo.png",
  },
  {
    name: "PotLock-Assistant",
    description: "Agent description here...",
    logo: "images/sonic-logo.png",
  },
  {
    name: "Bitte Distribute Tokens",
    description: "Agent description here...",
    logo: "images/sonic-logo.png",
  },
  {
    name: "Bitte WETH Wraptor",
    description: "Agent description here...",
    logo: "images/sonic-logo.png",
  },
];

export default function Dashboard({
  onToggle,
  onMobileNavToggle,
}: {
  onToggle: () => void;
  onMobileNavToggle: () => void;
}) {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex flex-col items-center h-screen bg-black text-white">
      <div
        className="bg-gray-900 p-4 flex items-center md:gap-5 gap-3 w-full"
        style={{ fontFamily: "orbitron" }}
      >
        <button
           onClick={() => {
            onToggle(); // Always toggle collapse state
            if (window.innerWidth < 768) {
              onMobileNavToggle(); // Only toggle mobile nav visibility on mobile screens
            }
          }}
          className="focus:outline-none"
        >
          <InlineSVG
            src="icons/Toggle.svg"
            className="w-5 h-5 cursor-pointer"
          />
        </button>
        <div className="xxl:text-lg xl:text-base text-gray-400 font-semibold">
          CHAT
        </div>
        <MdKeyboardArrowRight className="w-6 h-6" />
        <div className="text-white text-xs">VEJAS6QK0U1BTPQK</div>
      </div>

      <div className="flex justify-center items-centerm-4 md:flex-1 h-[550px] mt-[130px] md:mt-0 md:h-0 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col xl:w-[300px] xxl:w-[400px] bg-black p-4 m-4 rounded-lg border border-gray-700 overflow-hidden">
          {/* Header + Input */}
          <div className="flex-shrink-0">
            <h2
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "orbitron" }}
            >
              Agents
            </h2>
            <p
              className="text-sm text-gray-400 mb-4"
              style={{ fontFamily: "manrope" }}
            >
              Choose agents to perform specific tasks.
            </p>
            <div className="relative w-full flex items-center">
              <FaSearch className="absolute left-3 text-gray-400 xxl:text-lg xl:text-base" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 pl-10 bg-gray-800 text-white rounded placeholder:font-manrope placeholder:text-base placeholder:text-gray-400 focus:outline-none"
                style={{ fontFamily: "manrope" }}
              />
            </div>
          </div>

          {/* Scrollable List (Fixed) */}
          <div className="flex-grow overflow-y-auto border border-gray-700 p-3 mt-4 rounded max-h-[430px]">
            {agents.map((agent) => (
              <div
                key={agent.name}
                onClick={() => setActiveAgent(agent.name)}
                className={`p-4 rounded cursor-pointer rounded-md border transition-all mt-2 duration-200 bg-[#0c1a27] 
          ${
            activeAgent === agent.name
              ? "border-[#fde68a]"
              : "border-transparent hover:border-[#fde68a]"
          }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <img
                      src={agent.logo}
                      alt={agent.name}
                      className="h-6 rounded-full"
                    />
                    <h3 className="font-semibold text-xs overflow-hidden text-ellipsis whitespace-nowrap w-[80%]">
                      {agent.name.length > 15
                        ? agent.name.slice(0, 20) + "..."
                        : agent.name}
                    </h3>
                  </div>
                  <IoMdInformationCircleOutline className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>
                <p className="text-sm text-gray-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap w-[90%]">
                  {agent.description.length > 15
                    ? agent.description.slice(0, 35) + "..."
                    : agent.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center h-full">
          {/* Execute Transactions with AI Box */}
          <div className="flex-1 flex items-center justify-center bg-gray-950 border border-gray-700 rounded-lg md:mt-4 md:mx-4 xl:px-[200px] p-[60px]">
            <div className="text-center">
              <div className="flex justify-center items-center">
                <img
                  src="images/sonic-logo.png"
                  className="md:h-[100px] h-[50px]"
                />
              </div>
              <h2
                className="xxl:text-xl xl:text-lg font-semibold text-sm"
                style={{ fontFamily: "orbitron" }}
              >
                Execute Transactions with AI
              </h2>
              <button
                className="mt-4 bg-white text-black md:px-7 md:py-2 px-3 md:text-sm text-xs py-1 rounded font-semibold"
                style={{ fontFamily: "manrope" }}
              >
                Connect
              </button>
            </div>
          </div>

          {/*Desktop */}
          <div className="flex md:flex hidden p-4 py-3 border border-gray-700 rounded-lg md:m-4 mt-3">
            {/* Input Container */}

            <div className="flex-1 bg-gray-900 rounded flex md:flex-row flex-col md:items-center items-start border border-gray-700 px-2">
              <span
                className="px-3 py-1 bg-[#fbb042] hidden md:block rounded text-black md:text-sm text-[8px] font-bold"
                style={{ fontFamily: "orbitron" }}
              >
                {activeAgent ? activeAgent.toUpperCase() : "SONIC ASSISTANT"}
              </span>
              <input
                type="text"
                placeholder="Message Smart Actions"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 md:p-2 mt-2 md:mt-0 bg-transparent outline-none text-white md:ml-2 placeholder-gray-400"
                style={{ fontFamily: "manrope" }}
              />
            </div>

            {/* Arrow Button */}
            <div
              className={`md:w-12 w-10 flex cursor-pointer justify-center items-center px-2 py-2 rounded ml-3 transition-all ${
                message.trim() ? "bg-[#0000ff]" : "bg-gray-700"
              }`}
            >
              <BiUpArrowAlt className="w-8 h-8 text-white" />
            </div>
          </div>

          {/*Mobile -------------------*/}
          <div className="flex flex-col gap-3 py-4 px-3 border border-gray-700 rounded-lg md:m-4 mt-3 md:hidden">
            <div className="flex flex-row items-center justify-between">
              {/* Active Agent Name */}
              <span
                className="px-3 py-1 bg-[#fbb042] rounded text-black text-xs md:text-sm font-bold"
                style={{ fontFamily: "orbitron" }}
              >
                {activeAgent ? activeAgent.toUpperCase() : "SONIC ASSISTANT"}
              </span>

              {/* Agents Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded transition-all duration-200"
              >
                Agents
              </button>

              {/* Agents Modal */}
              <AgentsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                setActiveAgent={setActiveAgent}
              />
            </div>

            {/* Input Box & Send Button */}
            <div className="flex flex-row items-center bg-gray-900 rounded border border-gray-700 px-3 py-2">
              <input
                type="text"
                placeholder="Message Smart Actions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-400 p-2"
                style={{ fontFamily: "manrope" }}
              />

              {/* Send Button with Better Positioning */}
              <button
                className={`ml-3 p-2 rounded flex items-center justify-center transition-all ${
                  message.trim()
                    ? "bg-[#0000ff] hover:bg-blue-700"
                    : "bg-gray-700"
                }`}
                disabled={!message.trim()}
              >
                <BiUpArrowAlt className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
