import { Alert, AlertIcon, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useContractProvider } from "@/context/ContractContext";
import Proposal from "../Proposal/Proposal";
import { useWorkflowStatusReadProvider } from "@/context/WorkflowStatusContext";
import { useAccount } from "wagmi";

const ListProposals = ({ voter, setVoter }) => {
  const { readContract, provider } = useContractProvider();
  const { address } = useAccount();
  const workflowStatus = useWorkflowStatusReadProvider();

  const [winningProposal, setWinningProposal] = useState({ description: "", voteCount: 0, id: 0 });

  const [proposals, _setProposals] = useState([]);
  const proposalsRef = useRef(proposals);
  const setProposals = (data) => {
    proposalsRef.current = data;
    _setProposals(data);
  };

  useEffect(() => {
    loadProposals();
    subscribeToProposalEvents();
    subscribeToVotedEvents();
    if (workflowStatus === 5) {
      getWinningProposal();
    }
    return () => {
      readContract.off("Voted", updateVoteListener);
      readContract.off("ProposalRegistered", registerProposalListener);
    };
  }, []);

  useEffect(() => {
    if (workflowStatus === 5) {
      getWinningProposal();
    }
  }, [workflowStatus]);

  const subscribeToVotedEvents = async () => {
    const startBlockNumber = await provider.getBlockNumber();
    readContract.on("Voted", async (voterAddress, proposalId, event) => {
      updateVoteListener(voterAddress, proposalId, event, startBlockNumber);
    });
  };

  const updateVoteListener = async (voterAddress, proposalId, event, startBlockNumber) => {
    if (event.blockNumber <= startBlockNumber) return;
    const propIdFromBN = proposalId.toString();
    let updatedProposals = [...proposalsRef.current];
    const index = updatedProposals.findIndex((prop) => prop.id === propIdFromBN);
    updatedProposals[index].voteCount++;
    setProposals(updatedProposals);
    if (address === voterAddress) {
      setVoter({
        isRegistered: true,
        hasVoted: true,
        votedProposalId: propIdFromBN,
      });
    }
  };

  const subscribeToProposalEvents = async () => {
    const startBlockNumber = await provider.getBlockNumber();
    readContract.on("ProposalRegistered", async (proposalId, event) =>
      registerProposalListener(proposalId, event, startBlockNumber)
    );
  };

  const registerProposalListener = async (proposalId, event, startBlockNumber) => {
    if (event.blockNumber <= startBlockNumber) return;
    let proposalList = [...proposalsRef.current];
    const proposal = await readContract.connect(address).getOneProposal(proposalId);
    proposalList.push({
      id: proposalId.toString(),
      description: proposal.description,
      voteCount: proposal.voteCount.toString(),
    });
    setProposals(proposalList);
  };

  const loadProposals = async () => {
    // retrieve all ProposalRegistered events by batch of 5000 blocks
    const contractDeployBlock = parseInt(process.env.NEXT_PUBLIC_SC_DEPLOY_BLOCK);
    const currentBlockNumber = await provider.getBlockNumber();
    let proposalRegisteredEvents = [];
    for (let startBlock = contractDeployBlock; startBlock < currentBlockNumber; startBlock += 5000) {
      const endBlock = Math.min(currentBlockNumber, startBlock + 4999);
      console.log(`Start block ${startBlock} -- End block ${endBlock}`);
      const events = await readContract.queryFilter("ProposalRegistered", startBlock, endBlock);
      proposalRegisteredEvents = [...proposalRegisteredEvents, ...events];
    }

    // build proposal list from the retrieved events
    let proposalList = [];
    for (const event of proposalRegisteredEvents) {
      const proposalId = event.args.proposalId.toString();
      const proposal = await readContract.connect(address).getOneProposal(proposalId);
      proposalList.push({
        id: proposalId,
        description: proposal.description,
        voteCount: proposal.voteCount.toString(),
      });
    }
    setProposals(proposalList);
  };

  const getWinningProposal = async () => {
    const winningId = await readContract.winningProposalID();
    const winningProposal = await readContract.connect(address).getOneProposal(winningId);
    setWinningProposal({
      description: winningProposal.description,
      voteCount: winningProposal.voteCount.toString(),
      id: winningId.toString(),
    });
  };

  return (
    <>
      {workflowStatus === 5 ? (
        <Proposal proposal={winningProposal} />
      ) : (
        <>
          <Text as="b">Registered Proposals</Text>
          <Flex width="100%" direction={["column", "column", "row", "row"]} alignItems="center" flexWrap="wrap">
            {proposalsRef.current.length !== 0 ? (
              proposalsRef.current.map((proposal) => {
                return <Proposal proposal={proposal} key={proposal.id} hasVoted={voter.hasVoted} />;
              })
            ) : (
              <Flex height="100%" width="100%" alignItems="center" justifyContent="center">
                <Alert status="warning" width="300px">
                  <AlertIcon />
                  <Flex direction="column">
                    <Text as="span">There are no submitted proposals yet.</Text>
                  </Flex>
                </Alert>
              </Flex>
            )}
          </Flex>
        </>
      )}
    </>
  );
};

export default ListProposals;
