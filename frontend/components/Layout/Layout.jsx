import { Flex } from "@chakra-ui/react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import WorkflowStatus from "../WorkflowStatus/WorkflowStatus";

const Layout = ({ children }) => {
  return (
    <>
      <Flex direction="column" minHeight="100vh">
        <Header />
        <WorkflowStatus />
        <Flex flexGrow="1" p="2rem">
          {children}
        </Flex>
        <Footer />
      </Flex>
    </>
  );
};

export default Layout;
