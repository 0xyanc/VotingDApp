import React, { useContext, useEffect, useState } from "react";
import { useContractProvider } from "./ContractContext";

const WorkflowStatusContext = React.createContext(null);

export function useWorkflowStatusProvider() {
  const context = useContext(WorkflowStatusContext);

  if (!context) {
    throw new Error("useWorkflowStatusProvider must be used within a WorkflowStatusProvider");
  }
  return context;
}

export const WorkflowStatusProvider = ({ children }) => {
  const { readContract } = useContractProvider();
  const [workflowStatus, setWorkflowStatus] = useState("");

  useEffect(() => {
    getWorkflowStatus();
    subscribeToStatusEvents();
    return () => readContract.removeAllListeners();
  }, []);

  const getWorkflowStatus = async () => {
    const status = await readContract.workflowStatus();
    console.log(`WorkflowStatus is ${status}`);
    setWorkflowStatus(status);
  };

  const subscribeToStatusEvents = async () => {
    readContract.on("WorkflowStatusChange", (previousStatus, newStatus) => {
      setWorkflowStatus(newStatus);
      console.log(`WorkflowStatus is ${newStatus}`);
    });
  };

  return <WorkflowStatusContext.Provider value={{ workflowStatus }}>{children}</WorkflowStatusContext.Provider>;
};

export default WorkflowStatusContext;
