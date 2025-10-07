import type { PendingItem, RunAgentResponse, ApproveResponse } from '@/types/agent';
import { API_BASE } from './config';

type RequestOptions = RequestInit & { skipJson?: boolean };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipJson, headers, ...rest } = options;
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...rest,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request to ${path} failed with ${response.status}`);
  }

  if (skipJson) {
    return undefined as unknown as T;
  }

  return (await response.json()) as T;
}

export async function fetchPending(): Promise<PendingItem[]> {
  return request<PendingItem[]>('/pending');
}

export async function runAgent(userInput: string): Promise<RunAgentResponse> {
  return request<RunAgentResponse>('/run-agent', {
    method: 'POST',
    body: JSON.stringify({ user_input: userInput }),
  });
}

export async function approveSession(sessionId: string): Promise<ApproveResponse> {
  return request<ApproveResponse>(`/approve/${sessionId}`, {
    method: 'POST',
  });
}
