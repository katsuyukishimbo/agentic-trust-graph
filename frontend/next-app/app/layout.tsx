import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Roboto } from 'next/font/google';
import theme from '@/theme';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Agentic Trust Graph HITL Demo',
  description: 'LangGraph + HITL approval demo with Next.js front-end.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
