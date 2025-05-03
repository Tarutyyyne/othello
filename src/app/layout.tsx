'use client';

import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>Tarutyyyne's Othello</title>
        {/* ここをいじりました */}
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" href="favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
