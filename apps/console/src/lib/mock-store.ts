import type { Job, JobStatus, Offer } from './api';

const now = new Date();
const plusHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();

const jobSeed: Job[] = [
  {
    id: 'job_1',
    status: 'created',
    pickupAddr: 'Unit A',
    pickupPostcode: 'CH1 1AA',
    pickupTs: plusHours(2),
    deliveryAddr: 'Depot B',
    deliveryPostcode: 'M1 1AA',
    deliveryTs: plusHours(5),
    description: 'Pallets - handle with care',
    category: 'general',
    offers: [],
    exchange: null,
  },
  {
    id: 'job_2',
    status: 'offered',
    pickupAddr: 'Grove Street 8',
    pickupPostcode: 'SW1A 1AA',
    pickupTs: plusHours(1),
    deliveryAddr: 'Warehouse 12',
    deliveryPostcode: 'E1 6AN',
    deliveryTs: plusHours(3),
    description: 'Medical samples',
    category: 'medical',
    offers: [
      {
        id: 'offer_1',
        jobId: 'job_2',
        driverId: 'driver_1',
        ratePence: 12000,
        status: 'pending',
        expiresAt: plusHours(0.5),
      },
    ],
    exchange: null,
  },
  {
    id: 'job_3',
    status: 'accepted',
    pickupAddr: 'Dock 5',
    pickupPostcode: 'L1 8JQ',
    pickupTs: plusHours(4),
    deliveryAddr: 'City Office',
    deliveryPostcode: 'M2 2AA',
    deliveryTs: plusHours(6),
    description: 'Legal documents',
    category: 'legal',
    offers: [
      {
        id: 'offer_2',
        jobId: 'job_3',
        driverId: 'driver_2',
        ratePence: 15000,
        status: 'accepted',
        expiresAt: plusHours(1),
      },
    ],
    exchange: { exchange: 'SDCN', externalId: 'EX-54321' },
  },
];

export const jobs = new Map<string, Job>(jobSeed.map((job) => [job.id, job]));
export const offers = new Map<string, Offer>(
  jobSeed.flatMap((job) => job.offers ?? []).map((offer) => [offer.id, offer])
);
export const availability = new Map<string, string>();

export const listJobsByStatus = (status: JobStatus) => {
  return Array.from(jobs.values()).filter((job) => job.status === status);
};

export const getJob = (id: string) => jobs.get(id);

export const addOffer = (offer: Offer) => {
  offers.set(offer.id, offer);
  const job = jobs.get(offer.jobId);
  if (job) {
    job.offers = [...(job.offers ?? []), offer];
    job.status = 'offered';
  }
};

export const acceptOffer = (offerId: string) => {
  const offer = offers.get(offerId);
  if (!offer) {
    return;
  }
  offer.status = 'accepted';
  offers.set(offerId, offer);
  const job = jobs.get(offer.jobId);
  if (job) {
    job.status = 'accepted';
    job.offers = (job.offers ?? []).map((entry) =>
      entry.id === offerId ? { ...entry, status: 'accepted' } : entry
    );
  }
};

export const setExchange = (jobId: string, exchange: string, externalId: string) => {
  const job = jobs.get(jobId);
  if (!job) {
    return;
  }
  job.exchange = { exchange, externalId };
};
