import { useWorkflowStatusProvider } from "@/context/WorkflowStatusContext";
import { Card, CardBody, Flex, Heading } from "@chakra-ui/react";
import { statusMap } from "@/util/constants";

const WorkflowStatus = () => {
  const { workflowStatus } = useWorkflowStatusProvider();

  return (
    <Flex h="10vh" pb="1rem" alignItems="center" m="auto">
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
