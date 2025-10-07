'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { approveSession, fetchPending, runAgent } from '@/lib/api';
import type { ApproveResponse, PendingItem, RunAgentResponse } from '@/types/agent';

export type AgentWorkflowState = {
  pending: PendingItem[];
  loadingPending: boolean;
  submitting: boolean;
  approvingId: string | null;
  error: string | null;
};

export type AgentWorkflowApi = AgentWorkflowState & {
  submit: (input: string) => Promise<RunAgentResponse>;
  approve: (sessionId: string) => Promise<ApproveResponse>;
  refresh: () => Promise<void>;
  clearError: () => void;
};

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay <= 0) {
      return undefined;
    }
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function useAgentWorkflow(pollInterval = 4000): AgentWorkflowApi {
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('予期しないエラーが発生しました');
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoadingPending(true);
    try {
      const data = await fetchPending();
      setPending(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingPending(false);
    }
  }, [handleError]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useInterval(() => {
    void refresh();
  }, pollInterval);

  const submit = useCallback(
    async (input: string) => {
      setSubmitting(true);
      try {
        const response = await runAgent(input);
        await refresh();
        return response;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [handleError, refresh],
  );

  const approve = useCallback(
    async (sessionId: string) => {
      setApprovingId(sessionId);
      try {
        const response = await approveSession(sessionId);
        await refresh();
        return response;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setApprovingId((current) => (current === sessionId ? null : current));
      }
    },
    [handleError, refresh],
  );

  const clearError = useCallback(() => setError(null), []);

  return useMemo(
    () => ({
      pending,
      loadingPending,
      submitting,
      approvingId,
      error,
      submit,
      approve,
      refresh,
      clearError,
    }),
    [approve, approvingId, clearError, error, loadingPending, pending, refresh, submit, submitting],
  );
}
