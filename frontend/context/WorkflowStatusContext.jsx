import { createContext, useContext, useEffect, useState } from "react";

const WorkflowStatusContext = createContext();

export const useWorkflowStatusProvider = () => {
  return useContext(WorkflowStatusContext);
};

export const useWorkflowStatusReadProvider = () => {
  const [workflowStatus] = useContext(WorkflowStatusContext);
  return workflowStatus;
};

export const WorkflowStatusProvider = ({ children }) => {
  const workflowStatusCtx = useState(0);
  return <WorkflowStatusContext.Provider value={workflowStatusCtx}>{children}</WorkflowStatusContext.Provider>;
};

export default WorkflowStatusContext;
