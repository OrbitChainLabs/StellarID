import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StellarID',
  description: 'Decentralized identity platform on Stellar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
