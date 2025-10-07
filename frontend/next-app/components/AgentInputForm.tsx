'use client';

import { useState } from 'react';
import { Button, Card, CardActions, CardContent, Stack, TextField, Typography } from '@mui/material';

export type AgentInputFormProps = {
  onSubmit: (value: string) => Promise<void> | void;
  submitting?: boolean;
};

export default function AgentInputForm({ onSubmit, submitting = false }: AgentInputFormProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!value.trim()) {
      setError('入力内容を記入してください');
      return;
    }
    try {
      await onSubmit(value.trim());
      setValue('');
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('送信中にエラーが発生しました');
      }
    }
  };

  return (
    <Card component="section">
      <CardContent>
        <Stack spacing={2}>
          <div>
            <Typography variant="h5" component="h2" gutterBottom>
              フィードバックを入力
            </Typography>
            <Typography variant="body2" color="text.secondary">
              レビュー・バグ報告・改善要望などを記入してエージェントに送信します。
            </Typography>
          </div>
          <TextField
            multiline
            minRows={5}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) {
                setError(null);
              }
            }}
            placeholder="例：通知が遅れることがある。設定画面の文言が分かりづらい。"
            error={Boolean(error)}
            helperText={error || 'AIが分類と要件定義を行い、承認待ちリストに追加します。'}
            fullWidth
          />
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 3, pb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '送信中…' : 'エージェントを実行'}
        </Button>
      </CardActions>
    </Card>
  );
}
