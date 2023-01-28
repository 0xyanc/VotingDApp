import { Alert, AlertIcon, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useContractProvider } from "@/context/ContractContext";
import Proposal from "../Proposal/Proposal";
import { useWorkflowStatusProvider } from "@/context/WorkflowStatusContext";

const ListProposals = ({ voter, setVoter }) => {
  const { readContract, provider } = useContractProvider();
  const { workflowStatus } = useWorkflowStatusProvider();

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
    // if (workflowStatus === 5) {
    //   getWinningProposal();
    // }
    return () => readContract.removeAllListeners();
  }, []);

  useEffect(() => {
    if (workflowStatus === 5) {
      getWinningProposal();
    }
  }, [workflowStatus]);

  const subscribeToVotedEvents = async () => {
    const startBlockNumber = await provider.getBlockNumber();
    readContract.on("Voted", async (voterAddress, proposalId, event) => {
      if (event.blockNumber <= startBlockNumber) return;
      let updatedProposals = [...proposalsRef];
      const proposal = updatedProposals.filter((prop) => prop.id === proposalId);
      proposal.voteCount++;
      setProposals(updatedProposals);
      let updatedVoter = voter;
      updatedVoter.hasVoted = true;
      setVoter(updatedVoter);
    });
  };

  const subscribeToProposalEvents = async () => {
    const startBlockNumber = await provider.getBlockNumber();
    readContract.on("ProposalRegistered", async (proposalId, event) => {
      if (event.blockNumber <= startBlockNumber) return;
      let proposalList = [...proposalsRef.current];
      const proposal = await readContract.getOneProposal(proposalId);
      proposalList.push({
        id: proposalId,
        description: proposal.description,
        voteCount: proposal.voteCount.toString(),
      });
      setProposals(proposalList);
    });
  };

  const loadProposals = async () => {
    const contractDeployBlock = parseInt(process.env.NEXT_PUBLIC_SC_DEPLOY_BLOCK);
    let proposalRegisteredEvents = await readContract.queryFilter("ProposalRegistered", contractDeployBlock);
    let proposalList = [];
    for (const event of proposalRegisteredEvents) {
      const proposalId = event.args.proposalId.toString();
      const proposal = await readContract.getOneProposal(proposalId);
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
    const winningProposal = await readContract.getOneProposal(winningId);
    console.log(winningProposal);
    setWinningProposal({
      description: winningProposal.description,
      voteCount: winningProposal.voteCount.toString(),
      id: winningId,
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
                    <Text as="span">There are no proposals on our DApp.</Text>
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
