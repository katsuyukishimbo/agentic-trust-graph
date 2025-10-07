'use client';

import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import PendingCard from './PendingCard';
import type { PendingItem } from '@/types/agent';

export type PendingListProps = {
  items: PendingItem[];
  loading?: boolean;
  approvingId?: string | null;
  onApprove: (sessionId: string) => void | Promise<void>;
};

export default function PendingList({ items, loading = false, approvingId = null, onApprove }: PendingListProps) {
  const hasPending = items.length > 0;

  return (
    <Stack spacing={2} component="section">
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          HITL承認待ち
        </Typography>
        <Typography variant="body2" color="text.secondary">
          LangGraphが整形した要件を確認し、承認すると保存フローが実行されます。
        </Typography>
      </Box>

      {loading && (
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary">
            承認待ちを読み込んでいます…
          </Typography>
        </Stack>
      )}

      {!loading && !hasPending && (
        <Alert severity="info" variant="outlined">
          現在、承認待ちのアイテムはありません。新しいフィードバックを送信してみましょう。
        </Alert>
      )}

      {!loading && hasPending && (
        <Stack spacing={2}>
          {items.map((item) => (
            <PendingCard
              key={item.session_id}
              item={item}
              onApprove={onApprove}
              approving={approvingId === item.session_id}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
