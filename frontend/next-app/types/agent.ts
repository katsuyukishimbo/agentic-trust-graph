export type PendingItem = {
  session_id: string;
  output: string;
  classification?: string;
  prompt_hash?: string;
};

export type RunAgentResponse = {
  status: 'pending' | 'complete' | string;
  session_id: string;
  output: string;
  classification?: string;
  prompt_hash?: string;
};

export type ApproveResponse = {
  status: string;
  result?: unknown;
  error?: string;
};
