import { ethers } from "ethers";
import React, { useContext } from "react";
import { useContract, useProvider, useSigner } from "wagmi";
import Contract from "../Voting.json";

const ContractContext = React.createContext(null);

export function useContractProvider() {
  const context = useContext(ContractContext);

  if (!context) {
    throw new Error("useContractProvider must be used within a ContractProvider");
  }
  return context;
}

export const ContractProvider = ({ children }) => {
  const contractAddress = process.env.NEXT_PUBLIC_SC_ADDRESS;
  const provider = useProvider();
  const { data: signer } = useSigner();
  const readContract = useContract({
    address: contractAddress,
    abi: Contract.abi,
    signerOrProvider: provider,
  });

  const writeContract = useContract({
    address: contractAddress,
    abi: Contract.abi,
    signerOrProvider: signer,
  });

  // const readContract = new ethers.Contract(contractAddress, Contract.abi, provider);
  // const writeContract = new ethers.Contract(contractAddress, Contract.abi, signer);

  return (
    <ContractContext.Provider value={{ readContract, writeContract, provider }}>{children}</ContractContext.Provider>
  );
};

export default ContractContext;
