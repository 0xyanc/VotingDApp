import { useContractProvider } from "@/context/ContractContext";
import { useWorkflowStatusReadProvider } from "@/context/WorkflowStatusContext";
import { Alert, AlertIcon, Divider, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AddProposal from "../AddProposal/AddProposal";
import ListProposals from "../ListProposals/ListProposals";
import WorkflowStatus from "../WorkflowStatus/WorkflowStatus";

const Voting = () => {
  const { readContract, provider } = useContractProvider();
  const { address, isConnected } = useAccount();
  const workflowStatus = useWorkflowStatusReadProvider();

  const [voter, setVoter] = useState({ address, isRegistered: false });
  useEffect(() => {
    if (isConnected) {
      checkVoterAddress();
      subscribeToEvents();
    }
    return () => readContract.off("VoterRegistered", checkVoterListener);
  }, [address, isConnected]);

  const subscribeToEvents = async () => {
    const startBlockNumber = await provider.getBlockNumber();
    readContract.on("VoterRegistered", (voterAddress, event) =>
      checkVoterListener(voterAddress, event, startBlockNumber)
    );
  };

  const checkVoterListener = (voterAddress, event, startBlockNumber) => {
    if (event.blockNumber <= startBlockNumber) return;
    console.log(address);
    if (voterAddress === address) checkVoterAddress();
  };

  const checkVoterAddress = async () => {
    try {
      const voter = await readContract.connect(address).getVoter(address);
      setVoter({
        address,
        isRegistered: voter.isRegistered,
        hasVoted: voter.hasVoted,
        votedProposalId: voter.votedProposalId.toString(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const renderAddProposalOrInfoBox = () => {
    switch (workflowStatus) {
      case 0:
        return (
          <Flex>
            <Alert status="info">
              <AlertIcon />
              You are whitelisted! Please wait for the admin to start the proposal registration phase
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
      default:
        return <></>;
    }
  };

  return (
    <>
      <Flex direction="column" w="100%" alignItems="center">
        <WorkflowStatus />
        {isConnected ? (
          workflowStatus === 5 ? (
            <>
              <Flex>
                <Alert status="success">
                  <AlertIcon />
                  The winning proposal has been declared, please check it below!
                </Alert>
              </Flex>
              <Divider mt="1rem" mb="1rem" />
              <ListProposals voter={voter} />
            </>
          ) : voter && voter.isRegistered ? (
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
    </>
  );
};

export default Voting;
