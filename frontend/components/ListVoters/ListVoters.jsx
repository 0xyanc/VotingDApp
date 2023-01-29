import { Alert, AlertIcon, Flex, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import { useContractProvider } from "@/context/ContractContext";

const ListVoters = () => {
  const { readContract, provider } = useContractProvider();

  const [voters, _setVoters] = useState([]);
  const votersRef = useRef(voters);
  const setVoters = (data) => {
    votersRef.current = data;
    _setVoters(data);
  };

  useEffect(() => {
    loadVoters();
    subscribeToEvents();
    return () => readContract.off("VoterRegistered", updateVotersListener);
  }, []);

  const subscribeToEvents = async () => {
    const startBlockNumber = await provider.getBlockNumber();
    readContract.on("VoterRegistered", (voterAddress, event) =>
      updateVotersListener(voterAddress, event, startBlockNumber)
    );
  };

  const updateVotersListener = (voterAddress, event, startBlockNumber) => {
    if (event.blockNumber <= startBlockNumber) return;
    let voterList = [...votersRef.current, voterAddress];
    setVoters(voterList);
  };

  const loadVoters = async () => {
    // retrieve all ProposalRegistered events by batch of 5000 blocks
    const contractDeployBlock = parseInt(process.env.NEXT_PUBLIC_SC_DEPLOY_BLOCK);
    const currentBlockNumber = await provider.getBlockNumber();
    let voterRegisteredEvents = [];
    for (let startBlock = contractDeployBlock; startBlock < currentBlockNumber; startBlock += 5000) {
      const endBlock = Math.min(currentBlockNumber, startBlock + 4999);
      const events = await readContract.queryFilter("VoterRegistered", startBlock, endBlock);
      voterRegisteredEvents = [...voterRegisteredEvents, ...events];
    }
    // add all the whitelisted voters to the list
    let voterList = [];
    voterRegisteredEvents.map((event) => voterList.push(event.args.voterAddress));
    setVoters(voterList);
  };

  return (
    <>
      <Flex direction="column" p="1rem">
        {voters.length !== 0 ? (
          <>
            <Text as="b">Registered Voters</Text>
            <List spacing={2}>
              {voters.map((voter) => {
                return (
                  <ListItem key={voter}>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    {voter}
                  </ListItem>
                );
              })}
            </List>
          </>
        ) : (
          <Alert status="info">
            <AlertIcon />
            No Voter has been registered yet.
          </Alert>
        )}
      </Flex>
    </>
  );
};

export default ListVoters;
