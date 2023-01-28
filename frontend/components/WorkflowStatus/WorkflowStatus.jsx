import { useWorkflowStatusProvider } from "@/context/WorkflowStatusContext";
import { Card, CardBody, Flex, Heading } from "@chakra-ui/react";
import { statusMap } from "@/util/constants";
import { useContractProvider } from "@/context/ContractContext";
import { useEffect } from "react";

const WorkflowStatus = () => {
  const { readContract } = useContractProvider();
  const [workflowStatus, setWorkflowStatus] = useWorkflowStatusProvider();

  useEffect(() => {
    getWorkflowStatus();
    subscribeToStatusEvents();
    return () => readContract.removeAllListeners("WorkflowStatusChange");
  }, []);

  const getWorkflowStatus = async () => {
    const status = await readContract.workflowStatus();
    console.log(`WorkflowStatus is ${status}`);
    setWorkflowStatus(status);
  };

  const subscribeToStatusEvents = async () => {
    console.log("Subscribe to WorkflowStatus Event");
    readContract.on("WorkflowStatusChange", (previousStatus, newStatus) => {
      setWorkflowStatus(newStatus);
      console.log(`WorkflowStatus is ${newStatus}`);
    });
  };

  return (
    <Flex h="10vh" alignItems="center" mb="2rem">
      <Card>
        <CardBody>
          <Flex direction="column" alignItems="center">
            <Heading size="xs">Current Workflow Status</Heading>
            <Heading color="blue" as="h2" size="lg">
              {statusMap.get(workflowStatus)}
            </Heading>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default WorkflowStatus;
