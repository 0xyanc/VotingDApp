import { useContractProvider } from "@/context/ContractContext";
import { useWorkflowStatusProvider } from "@/context/WorkflowStatusContext";
import { Alert, AlertIcon, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { useAccount, useBalance, useContract, useProvider } from "wagmi";
import AddProposal from "../AddProposal/AddProposal";
import ListProposals from "../ListProposals/ListProposals";
import Contract from "../../Voting.json";

const Voting = () => {
  const { readContract, provider } = useContractProvider();

  const { address, isConnected } = useAccount();
  const { workflowStatus } = useWorkflowStatusProvider();

  const [voter, setVoter] = useState(null);
  useEffect(() => {
    if (isConnected) {
      checkVoterAddress();
      subscribeToEvents();
    }
    return () => readContract.removeAllListeners();
  }, [address, isConnected]);

  const subscribeToEvents = async () => {
    const startBlockNumber = await provider.getBlockNumber();
    readContract.on("VoterRegistered", (voterAddress, event) => {
      if (event.blockNumber <= startBlockNumber) return;
      console.log(address);
      if (voterAddress === address) checkVoterAddress();
    });
  };

  const checkVoterAddress = async () => {
    try {
      console.log(address);
      // const readContract = new ethers.Contract(contractAddress, Contract.abi, provider);
      const voter = await readContract.getVoter(address);
      setVoter(voter);
    } catch (err) {
      console.log(err);
      setVoter(null);
    }
  };

  const renderAddProposalOrInfoBox = () => {
    switch (workflowStatus) {
      case 0:
        return (
          <Flex>
            <Alert status="info">
              <AlertIcon />
              Please wait for the admin to start the proposal registration phase
            </Alert>
          </Flex>
        );
      case 1:
        return <AddProposal />;
      case 2:
        return (
          <Flex>
            <Alert status="info">
              <AlertIcon />
              Please wait for the admin to start the voting session
            </Alert>
          </Flex>
        );
      case 3:
        return (
          <Flex>
            <Alert status="info">
              <AlertIcon />
              Vote for your favourite proposal
            </Alert>
          </Flex>
        );
      case 4:
        return (
          <Flex>
            <Alert status="info">
              <AlertIcon />
              Please wait for the winning proposal to be declared
            </Alert>
          </Flex>
        );
      case 5:
        return (
          <Flex>
            <Alert status="success">
              <AlertIcon />
              The winning proposal has been declared, please check it below!
            </Alert>
          </Flex>
        );
      default:
        return <></>;
    }
  };
  return (
    <Flex direction="column" w="100%" alignItems="center">
      {isConnected ? (
        voter && voter.isRegistered ? (
          <>
            {renderAddProposalOrInfoBox()}
            <Divider mt="1rem" mb="1rem" />
            <ListProposals voter={voter} setVoter={setVoter} />
          </>
        ) : (
          <Flex>
            <Alert status="warning">
              <AlertIcon />
              You are not a whitelisted voter.
            </Alert>
          </Flex>
        )
      ) : (
        <Flex>
          <Alert status="info">
            <AlertIcon />
            Connect you wallet to start.
          </Alert>
        </Flex>
      )}
    </Flex>
  );
};

export default Voting;
