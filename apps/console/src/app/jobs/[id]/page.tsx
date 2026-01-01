'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { acceptOffer, createOffer, getJob, postExchange, type Job } from '@/lib/api';
import JobDetail from '@/components/JobDetail';
import { requireToken } from '@/lib/auth';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadJob = async () => {
    try {
      const data = await getJob(params.id);
      setJob(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
    }
  };

  useEffect(() => {
    requireToken();
    loadJob();
  }, [params.id]);

  const handleOffer = async (driverId: string, ratePence: number) => {
    await createOffer({ jobId: params.id, driverId, ratePence });
    await loadJob();
  };

  const handleAccept = async (offerId: string) => {
    await acceptOffer(offerId);
    await loadJob();
  };

  const handleExchange = async (exchange: string, externalId: string) => {
    await postExchange({ jobId: params.id, exchange, externalId });
    await loadJob();
  };

  if (error) {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white/70 p-8">
        <p className="text-sm text-ink/60">{error}</p>
        <button
          type="button"
          onClick={() => router.push('/jobs')}
          className="mt-4 rounded-full border border-ink/20 px-4 py-2 text-xs uppercase tracking-[0.2em]"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return <p className="text-sm text-ink/60">Loading…</p>;
  }

  return <JobDetail job={job} onOffer={handleOffer} onAccept={handleAccept} onExchange={handleExchange} />;
}
