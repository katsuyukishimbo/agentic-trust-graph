'use client';

import { Alert, Container, Snackbar, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AgentInputForm from '@/components/AgentInputForm';
import PendingList from '@/components/PendingList';
import { useAgentWorkflow } from '@/hooks/useAgentWorkflow';

export default function HomePage() {
  const { pending, submit, approve, loadingPending, submitting, approvingId, error, clearError } =
    useAgentWorkflow(3000);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' } | null>(
    null,
  );

  const handleSubmit = async (value: string) => {
    try {
      const response = await submit(value);
      const message = response.status === 'pending' ? '承認待ちに追加しました' : '処理が完了しました';
      setSnackbar({ open: true, message, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'エージェント実行でエラーが発生しました', severity: 'error' });
      throw err;
    }
  };

  const handleApprove = async (sessionId: string) => {
    try {
      const response = await approve(sessionId);
      const message = response.status === 'approved' ? '承認して保存しました' : '承認処理が完了しました';
      setSnackbar({ open: true, message, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: '承認処理でエラーが発生しました', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={5}>
        <Stack spacing={1}>
          <Typography variant="h3" component="h1">
            🧠 ユーザーの声を要件化し、信頼して活用する
          </Typography>
          <Typography variant="body1" color="text.secondary">
            フィードバックを送信するとLangGraphエージェントが分類・整形し、HITL承認後に保存フローを実行します。
          </Typography>
        </Stack>

        <AgentInputForm onSubmit={handleSubmit} submitting={submitting} />

        <PendingList
          items={pending}
          loading={loadingPending}
          approvingId={approvingId}
          onApprove={(sessionId) => {
            void handleApprove(sessionId);
          }}
        />
      </Stack>

      <Snackbar
        open={Boolean(snackbar?.open)}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => (prev ? { ...prev, open: false } : prev))}
      >
        {snackbar && (
          <Alert
            onClose={() => setSnackbar(null)}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        )}
      </Snackbar>

      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={clearError}>
        {error && (
          <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}
