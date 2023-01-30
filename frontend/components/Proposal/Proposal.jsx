import { useContractProvider } from "@/context/ContractContext";
import { useWorkflowStatusReadProvider } from "@/context/WorkflowStatusContext";
import { Button, Text, Card, CardBody, useToast } from "@chakra-ui/react";
import { useState } from "react";

const Proposal = ({ proposal, hasVoted, isRegistered }) => {
  const workflowStatus = useWorkflowStatusReadProvider();
  const { writeContract } = useContractProvider();
  const toast = useToast();

  const [waitTransaction, setWaitTransaction] = useState(false);

  const vote = async (proposalId) => {
    try {
      setWaitTransaction(true);
      const transaction = await writeContract.setVote(proposalId);
      await transaction.wait(1);
      toast({
        title: "Has voted!",
        description: "You successfully voted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error voting for a proposal",
        description: "An error occurred when voting a proposal",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setWaitTransaction(false);
    }
  };

  const renderVoteButton = () => {
    if (workflowStatus === 3) {
      if (hasVoted) {
        return <Text>Already voted</Text>;
      } else {
        return (
          <Button colorScheme="green" onClick={() => vote(proposal.id)} {...(waitTransaction && { isLoading: true })}>
            Vote
          </Button>
        );
      }
    }
  };

  return (
    <Card m="1rem" minWidth={["100%", "100%", "30%", "30%"]} ml="1%" mr="1%">
      <CardBody>
        {isRegistered ? (
          <>
            <Text mt="1rem" mb="1rem">
              <Text as="span" fontWeight="bold">
                Description
              </Text>
              : {proposal.description}
            </Text>
            <Text mt="1rem" mb="1rem">
              <Text as="span" fontWeight="bold">
                Vote Count
              </Text>
              : {proposal.voteCount}
            </Text>
            {renderVoteButton()}
          </>
        ) : (
          <Text mt="1rem" mb="1rem">
            <Text as="span" fontWeight="bold">
              Id of winning proposal
            </Text>
            : {proposal.id}
          </Text>
        )}
      </CardBody>
    </Card>
  );
};

export default Proposal;
