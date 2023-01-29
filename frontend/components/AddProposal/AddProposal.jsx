import { Button, Flex, Textarea, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useContractProvider } from "@/context/ContractContext";

const AddProposal = () => {
  const { writeContract } = useContractProvider();
  const toast = useToast();

  const [waitTransaction, setWaitTransaction] = useState(false);
  const [proposal, setProposal] = useState("");

  const addProposal = async () => {
    try {
      setWaitTransaction(true);
      const transaction = await writeContract.addProposal(proposal);
      const receipt = await transaction.wait(1);
      toast({
        title: "Proposal submitted",
        description: "The proposal has successfully been submitted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error adding a proposal",
        description: "An error occurred when adding a proposal",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setWaitTransaction(false);
      setProposal("");
    }
  };

  return (
    <Flex alignItems="center">
      <Textarea
        placeholder="Description of the proposal"
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
      />
      <Button
        ml="1rem"
        pr="2rem"
        pl="2rem"
        onClick={() => addProposal()}
        colorScheme="green"
        {...(waitTransaction && { isLoading: true })}
      >
        Add Proposal
      </Button>
    </Flex>
  );
};

export default AddProposal;
