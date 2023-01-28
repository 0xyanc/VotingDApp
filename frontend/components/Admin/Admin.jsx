import { useEffect, useState } from "react";
import AddVoter from "../AddVoter/AddVoter";
import ChangeStatus from "../ChangeStatus/ChangeStatus";
import ListVoters from "../ListVoters/ListVoters";
import { Divider, Flex, Heading } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useContractProvider } from "@/context/ContractContext";
import { useWorkflowStatusReadProvider } from "@/context/WorkflowStatusContext";
import WorkflowStatus from "../WorkflowStatus/WorkflowStatus";

const Admin = () => {
  const { address, isConnected } = useAccount();
  const { readContract } = useContractProvider();

  const workflowStatus = useWorkflowStatusReadProvider();
  const [adminAddress, setAdminAddress] = useState(null);

  useEffect(() => {
    getContractOwner();
  }, []);

  const getContractOwner = async () => {
    const owner = await readContract.owner();
    setAdminAddress(owner);
  };

  return (
    <>
      <Flex direction="column" w="100%" alignItems="center">
        <WorkflowStatus />
        {isConnected ? (
          address === adminAddress ? (
            <ChangeStatus />
          ) : (
            <Heading size="lg">You are not the admin.</Heading>
          )
        ) : (
          <Heading size="lg">Connect your wallet to start.</Heading>
        )}
        <Divider mt="1rem" mb="1rem" />
        <Flex direction="column">
          {isConnected && address === adminAddress && workflowStatus === 0 && <AddVoter />}
          <ListVoters />
        </Flex>
      </Flex>
    </>
  );
};

export default Admin;
