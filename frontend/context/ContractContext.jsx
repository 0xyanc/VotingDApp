import { createContext, useContext } from "react";
import { useContract, useProvider, useSigner } from "wagmi";
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
