'use client';

import { useState } from 'react';
import type { Job } from '@/lib/api';

export default function JobDetail({
  job,
  onOffer,
  onAccept,
  onExchange,
}: {
  job: Job;
  onOffer: (driverId: string, ratePence: number) => Promise<void>;
  onAccept: (offerId: string) => Promise<void>;
  onExchange: (exchange: string, externalId: string) => Promise<void>;
}) {
  const [driverId, setDriverId] = useState('driver_1');
  const [ratePence, setRatePence] = useState(12000);
  const [exchange, setExchange] = useState('SDCN');
  const [externalId, setExternalId] = useState('');

  const latestOffer = job.offers?.[job.offers.length - 1];

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-ink/10 bg-white/80 p-6 shadow-card">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Job Overview</p>
        <h2 className="font-display text-3xl text-ink">
          {job.pickupAddr} → {job.deliveryAddr}
        </h2>
        <div className="mt-4 grid gap-2 text-sm text-ink/70">
          <div>
            <strong className="text-ink">Pickup:</strong> {job.pickupPostcode} •{' '}
            {new Date(job.pickupTs).toLocaleString()}
          </div>
          <div>
            <strong className="text-ink">Drop:</strong> {job.deliveryPostcode} •{' '}
            {new Date(job.deliveryTs).toLocaleString()}
          </div>
          <div>
            <strong className="text-ink">Status:</strong> {job.status}
          </div>
          {job.exchange ? (
            <div>
              <strong className="text-ink">Exchange:</strong> {job.exchange.exchange} –{' '}
              {job.exchange.externalId}
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-ink/10 bg-white/70 p-6">
        <h3 className="font-display text-xl text-ink">Offer Actions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm text-ink/70">
            Driver ID
            <input
              value={driverId}
              onChange={(event) => setDriverId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/20 bg-white px-3 py-2 text-ink"
            />
          </label>
          <label className="text-sm text-ink/70">
            Rate (pence)
            <input
              type="number"
              value={ratePence}
              onChange={(event) => setRatePence(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-ink/20 bg-white px-3 py-2 text-ink"
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => onOffer(driverId, ratePence)}
              className="w-full rounded-2xl bg-ink px-4 py-3 text-sm uppercase tracking-[0.2em] text-sand"
            >
              Offer
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => latestOffer && onAccept(latestOffer.id)}
            disabled={!latestOffer}
            className="rounded-2xl border border-ink/20 bg-white px-4 py-2 text-sm uppercase tracking-[0.2em] text-ink disabled:opacity-50"
          >
            Accept Latest Offer
          </button>
          {latestOffer ? (
            <span className="text-xs text-ink/60">Latest offer: {latestOffer.id}</span>
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl border border-ink/10 bg-white/70 p-6">
        <h3 className="font-display text-xl text-ink">Exchange Posting</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="text-sm text-ink/70">
            Exchange
            <select
              value={exchange}
              onChange={(event) => setExchange(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/20 bg-white px-3 py-2 text-ink"
            >
              <option value="SDCN">SDCN</option>
              <option value="CX">CX</option>
            </select>
          </label>
          <label className="text-sm text-ink/70">
            External ID
            <input
              value={externalId}
              onChange={(event) => setExternalId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/20 bg-white px-3 py-2 text-ink"
              placeholder="EX-12345"
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => onExchange(exchange, externalId)}
              className="w-full rounded-2xl bg-ember px-4 py-3 text-sm uppercase tracking-[0.2em] text-white"
            >
              Post to Exchange
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
