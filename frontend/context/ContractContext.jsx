import { useAccordion } from "@chakra-ui/react";
import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useBalance, useContract, useProvider, useSigner } from "wagmi";
import Contract from "../Voting.json";

const ContractContext = createContext();

export function useContractProvider() {
  const context = useContext(ContractContext);

  if (!context) {
    throw new Error("useContractProvider must be used within a ContractProvider");
  }
  return context;
}

export const ContractProvider = ({ children }) => {
  const contractAddress = process.env.NEXT_PUBLIC_SC_ADDRESS;
  let provider = useProvider();
  let { data: signer } = useSigner();
  // const [readContract, setReadContract] = useState(new ethers.Contract(contractAddress, Contract.abi, provider));
  // const [writeContract, setWriteContract] = useState(new ethers.Contract(contractAddress, Contract.abi, signer));

  // useEffect(() => {
  //   setReadContract(new ethers.Contract(contractAddress, Contract.abi, provider));
  // }, [provider]);
  // useEffect(() => {
  //   setWriteContract(new ethers.Contract(contractAddress, Contract.abi, signer));
  // }, [signer]);
  let readContract = useContract({
    address: contractAddress,
    abi: Contract.abi,
    signerOrProvider: provider,
  });

  let writeContract = useContract({
    address: contractAddress,
    abi: Contract.abi,
    signerOrProvider: signer,
  });

  return (
    <ContractContext.Provider value={{ readContract, writeContract, provider, signer }}>
      {children}
    </ContractContext.Provider>
  );
};
