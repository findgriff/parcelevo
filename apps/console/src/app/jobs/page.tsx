'use client';

import { useEffect, useState } from 'react';
import { listJobs, type Job, type JobStatus } from '@/lib/api';
import JobList from '@/components/JobList';
import AvailabilityToggle from '@/components/AvailabilityToggle';
import { requireToken } from '@/lib/auth';

const statuses: JobStatus[] = ['created', 'offered', 'accepted'];

export default function JobsPage() {
  const [active, setActive] = useState<JobStatus>('created');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [counts, setCounts] = useState<Record<JobStatus, number>>({
    created: 0,
    offered: 0,
    accepted: 0,
  });

  useEffect(() => {
    requireToken();
  }, []);

  useEffect(() => {
    let mounted = true;
    listJobs(active)
      .then((data) => {
        if (mounted) {
          setJobs(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setJobs([]);
        }
      });

    Promise.all(statuses.map((status) => listJobs(status))).then((all) => {
      const next = { created: 0, offered: 0, accepted: 0 } as Record<JobStatus, number>;
      all.forEach((items, index) => {
        next[statuses[index]] = items.length;
      });
      setCounts(next);
    });

    return () => {
      mounted = false;
    };
  }, [active]);

  return (
    <div className="grid gap-8">
      <section className="rounded-3xl border border-ink/10 bg-white/80 p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Dispatch</p>
            <h2 className="font-display text-3xl text-ink">Jobs Overview</h2>
          </div>
          <AvailabilityToggle driverId="driver_1" />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setActive(status)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
              active === status
                ? 'border-ink bg-ink text-sand'
                : 'border-ink/20 bg-white/70 text-ink'
            }`}
          >
            {status} ({counts[status] ?? 0})
          </button>
        ))}
      </div>

      <JobList jobs={jobs} />
    </div>
  );
}
