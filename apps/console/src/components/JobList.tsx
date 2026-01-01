import Link from 'next/link';
import type { Job } from '@/lib/api';
import { ArrowRight } from 'lucide-react';

export default function JobList({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-ink/20 bg-white/70 p-10 text-center">
        <p className="text-sm text-ink/60">No jobs in this status.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="group rounded-3xl border border-ink/10 bg-white/80 p-6 shadow-card transition hover:-translate-y-1"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{job.category}</p>
              <h3 className="font-display text-xl text-ink">
                {job.pickupAddr} → {job.deliveryAddr}
              </h3>
              <p className="text-sm text-ink/60">
                {new Date(job.pickupTs).toLocaleString()} • {job.pickupPostcode} →{' '}
                {job.deliveryPostcode}
              </p>
            </div>
            <div className="flex items-center gap-3 text-ink/70">
              <span className="rounded-full border border-ink/10 px-3 py-1 text-xs uppercase">
                {job.status}
              </span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
