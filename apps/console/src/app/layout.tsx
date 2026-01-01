import './globals.css';
import { Fraunces, Space_Grotesk } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata = {
  title: 'ParcelEvo Console',
  description: 'Operator console for ParcelEvo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${space.variable}`}>
      <body className="bg-noise min-h-screen">
        <div className="min-h-screen">
          <header className="px-6 py-6 md:px-10">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-petrol">ParcelEvo</p>
                <h1 className="font-display text-2xl text-ink">Operator Console</h1>
              </div>
              <div className="text-sm text-ink/60">Mock-ready • v0</div>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 pb-16 md:px-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
