'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { requestMagicLink } from '@/lib/api';
import { setToken } from '@/lib/auth';

const EmailSchema = z.string().email();

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setTokenValue] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleMagicLink = async () => {
    try {
      EmailSchema.parse(email);
      await requestMagicLink(email);
      setStatus('Magic link requested. Check the server log (dev mode).');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Invalid email');
    }
  };

  const handleToken = () => {
    if (!token.trim()) {
      setStatus('Paste a token to continue.');
      return;
    }
    setToken(token.trim());
    router.push('/jobs');
  };

  return (
    <div className="grid gap-8">
      <section className="rounded-3xl border border-ink/10 bg-white/80 p-8 shadow-card">
        <h2 className="font-display text-3xl text-ink">Sign in</h2>
        <p className="mt-2 text-sm text-ink/60">
          Use the magic link flow or paste a JWT to access mock mode.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="text-sm text-ink/70">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/20 bg-white px-3 py-2 text-ink"
              placeholder="ops@parcelevo.com"
            />
          </label>
          <button
            type="button"
            onClick={handleMagicLink}
            className="rounded-2xl bg-ink px-4 py-3 text-sm uppercase tracking-[0.2em] text-sand"
          >
            Request Magic Link
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-ink/10 bg-white/70 p-8">
        <h3 className="font-display text-2xl text-ink">Dev token</h3>
        <p className="mt-2 text-sm text-ink/60">
          Paste any JWT here to bypass email in mock mode.
        </p>
        <div className="mt-4 grid gap-4">
          <textarea
            value={token}
            onChange={(event) => setTokenValue(event.target.value)}
            className="min-h-[120px] w-full rounded-2xl border border-ink/20 bg-white px-3 py-2 text-ink"
            placeholder="eyJhbGciOi..."
          />
          <button
            type="button"
            onClick={handleToken}
            className="rounded-2xl border border-ink/20 bg-white px-4 py-3 text-sm uppercase tracking-[0.2em] text-ink"
          >
            Paste Token & Continue
          </button>
        </div>
      </section>

      {status ? <p className="text-sm text-ink/70">{status}</p> : null}
    </div>
  );
}
