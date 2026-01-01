'use client';

import { useState } from 'react';
import { setAvailability } from '@/lib/api';

const states = ['OFFLINE', 'AVAILABLE', 'PAUSED'] as const;

export default function AvailabilityToggle({ driverId }: { driverId: string }) {
  const [active, setActive] = useState<(typeof states)[number]>('OFFLINE');
  const [saving, setSaving] = useState(false);

  const handleClick = async (state: (typeof states)[number]) => {
    setSaving(true);
    setActive(state);
    try {
      await setAvailability(driverId, state);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {states.map((state) => (
        <button
          key={state}
          type="button"
          onClick={() => handleClick(state)}
          className={`rounded-full border px-4 py-1 text-xs uppercase tracking-[0.2em] transition ${
            active === state
              ? 'border-ink bg-ink text-sand'
              : 'border-ink/20 bg-white/70 text-ink'
          }`}
        >
          {saving && active === state ? 'Saving…' : state}
        </button>
      ))}
    </div>
  );
}
