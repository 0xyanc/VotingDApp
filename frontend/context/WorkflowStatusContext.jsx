import { createContext, useContext, useState } from "react";

const WorkflowStatusContext = createContext();

export const useWorkflowStatusProvider = () => {
  const context = useContext(WorkflowStatusContext);

  if (context === undefined) {
    throw new Error("useWorkflowStatusProvider must be used within a WorkflowStatusContext");
  }

  return context;
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
