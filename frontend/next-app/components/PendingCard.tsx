'use client';

import { Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { PendingItem } from '@/types/agent';

export type PendingCardProps = {
  item: PendingItem;
  onApprove: (sessionId: string) => void | Promise<void>;
  approving?: boolean;
};

export default function PendingCard({ item, onApprove, approving = false }: PendingCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              セッションID: {item.session_id}
            </Typography>
            {item.classification && (
              <Chip label={item.classification} color="primary" size="small" />
            )}
            {item.prompt_hash && (
              <Chip label={`hash: ${item.prompt_hash}`} variant="outlined" size="small" />
            )}
          </Stack>
          <Typography
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              borderRadius: 2,
              p: 2,
            }}
          >
            {item.output}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <Button
          startIcon={<CheckCircleIcon />}
          variant="contained"
          color="secondary"
          onClick={() => onApprove(item.session_id)}
          disabled={approving}
        >
          {approving ? '承認処理中…' : '承認して保存'}
        </Button>
      </CardActions>
    </Card>
  );
}
