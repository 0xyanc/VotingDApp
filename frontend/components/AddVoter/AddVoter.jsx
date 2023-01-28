import { Button, Flex, FormControl, FormErrorMessage, FormHelperText, Input, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useContractProvider } from "@/context/ContractContext";
import Contract from "../../Voting.json";
import { useContract, useSigner } from "wagmi";

const AddVoter = () => {
  const toast = useToast();

  const [waitTransaction, setWaitTransaction] = useState(false);
  const [voter, setVoter] = useState("");
  const [isInputError, setIsInputError] = useState(true);

  const { writeContract } = useContractProvider();

  const addVoter = async () => {
    try {
      if (!ethers.utils.isAddress(voter)) {
        toast({
          title: "Address not valid",
          description: "The address of the voter is not valid",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      setWaitTransaction(true);
      const transaction = await writeContract.addVoter(voter);
      console.log(voter);
      transaction.wait(1);
      toast({
        title: "Voter added",
        description: "The voter has successfully been added to the whitelist",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error adding a voter",
        description: "An error occurred when adding a voter",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setWaitTransaction(false);
      setVoter("");
    }
  };

  const handleInputChange = (e) => {
    setVoter(e.target.value);
    setIsInputError(!ethers.utils.isAddress(e.target.value));
  };

  return (
    <Flex>
      <FormControl isInvalid={isInputError}>
        <Input placeholder="Address of the Voter" value={voter} onChange={(e) => handleInputChange(e)} />
        {!isInputError ? (
          <FormHelperText>Address is valid</FormHelperText>
        ) : (
          <FormErrorMessage>Please enter a valid address.</FormErrorMessage>
        )}
      </FormControl>
      <Button ml="1rem" onClick={() => addVoter()} colorScheme="green" {...(waitTransaction && { isLoading: true })}>
        Add Voter
      </Button>
    </Flex>
  );
};

export default AddVoter;
