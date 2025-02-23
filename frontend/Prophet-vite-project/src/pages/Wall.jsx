import React, { useState } from 'react';
import { ethers } from 'ethers';

const prophetContractAddress = "0xD44cd0688C4Fb843657112dbB065108EbA447dF3";
const prophetABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const WalletBalance = () => {
  const [balance, setBalance] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another crypto wallet.");
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      const prophetToken = new ethers.Contract(prophetContractAddress, prophetABI, provider);
      const decimals = await prophetToken.decimals();
      const rawBalance = await prophetToken.balanceOf(address);
      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 flex justify-between items-center">
      <button onClick={connectWallet} className="px-4 py-2 bg-purple-600 rounded-md text-white">
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>
      {balance !== null && (
        <div className="text-lg">
          Prophet Balance: <span className="font-bold">{balance} PRPHT</span>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;