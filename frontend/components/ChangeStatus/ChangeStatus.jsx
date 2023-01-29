import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import * as Constants from "@/util/constants";
import { useContractProvider } from "@/context/ContractContext";
import { useWorkflowStatusReadProvider } from "@/context/WorkflowStatusContext";

const ChangeStatus = () => {
  const workflowStatus = useWorkflowStatusReadProvider();
  const { writeContract } = useContractProvider();

  const [waitTransaction, setWaitTransaction] = useState(false);

  const startProposalsRegistering = async () => {
    try {
      setWaitTransaction(true);
      const transaction = await writeContract.startProposalsRegistering();
      const receipt = await transaction.wait(1);
    } catch (err) {
      console.log(err);
    } finally {
      setWaitTransaction(false);
    }
  };
  const endProposalsRegistering = async () => {
    try {
      setWaitTransaction(true);
      const transaction = await writeContract.endProposalsRegistering();
      const receipt = transaction.wait(1);
    } catch (err) {
      console.log(err);
    } finally {
      setWaitTransaction(false);
    }
  };
  const startVotingSession = async () => {
    try {
      setWaitTransaction(true);
      const transaction = await writeContract.startVotingSession();
      const receipt = await transaction.wait(1);
    } catch (err) {
      console.log(err);
    } finally {
      setWaitTransaction(false);
    }
  };
  const endVotingSession = async () => {
    try {
      setWaitTransaction(true);
      const transaction = await writeContract.endVotingSession();
      const receipt = await transaction.wait(1);
    } catch (err) {
      console.log(err);
    } finally {
      setWaitTransaction(false);
    }
  };
  const tallyVotes = async () => {
    try {
      setWaitTransaction(true);
      const transaction = await writeContract.tallyVotes();
      const receipt = await transaction.wait(1);
    } catch (err) {
      console.log(err);
    } finally {
      setWaitTransaction(false);
    }
  };

  const renderWorkflowButton = () => {
    switch (workflowStatus) {
      case 0:
        return (
          <Button
            onClick={() => startProposalsRegistering()}
            colorScheme="green"
            {...(waitTransaction && { isLoading: true })}
          >
            {Constants.BUTTON_START_PROPOSALS_REGISTERING}
          </Button>
        );
      case 1:
        return (
          <Button
            onClick={() => endProposalsRegistering()}
            colorScheme="green"
            {...(waitTransaction && { isLoading: true })}
          >
            {Constants.BUTTON_END_PROPOSALS_REGISTERING}
          </Button>
        );
      case 2:
        return (
          <Button
            onClick={() => startVotingSession()}
            colorScheme="green"
            {...(waitTransaction && { isLoading: true })}
          >
            {Constants.BUTTON_START_VOTING_SESSION}
          </Button>
        );
      case 3:
        return (
          <Button onClick={() => endVotingSession()} colorScheme="green" {...(waitTransaction && { isLoading: true })}>
            {Constants.BUTTON_END_VOTING_SESSION}
          </Button>
        );
      case 4:
        return (
          <Button onClick={() => tallyVotes()} colorScheme="green" {...(waitTransaction && { isLoading: true })}>
            {Constants.BUTTON_TALLY_VOTES}
          </Button>
        );
      default:
        return <></>;
    }
  };
  return (
    <>
      <Flex>{renderWorkflowButton()}</Flex>
    </>
  );
};

export default ChangeStatus;
