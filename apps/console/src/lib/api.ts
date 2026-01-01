import { getToken } from './auth';

export type JobStatus = 'created' | 'offered' | 'accepted';

export type Offer = {
  id: string;
  jobId: string;
  driverId: string;
  ratePence: number;
  status: 'pending' | 'accepted' | 'expired' | 'retracted';
  expiresAt: string;
};

export type Job = {
  id: string;
  status: JobStatus;
  pickupAddr: string;
  pickupPostcode: string;
  pickupTs: string;
  deliveryAddr: string;
  deliveryPostcode: string;
  deliveryTs: string;
  description?: string | null;
  category?: string;
  offers?: Offer[];
  exchange?: { exchange: string; externalId: string } | null;
};

const isMock = process.env.NEXT_PUBLIC_MOCK_API === '1';
const apiBase = isMock
  ? '/api/mock'
  : `${process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:5050'}/v1`;

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  const token = getToken();
  if (!isMock && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const requestMagicLink = async (email: string) => {
  if (isMock) {
    return;
  }
  await request<void>('/auth/magic-link', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const listJobs = async (status: JobStatus) => {
  return request<Job[]>(`/jobs?status=${status}`);
};

export const getJob = async (id: string) => {
  return request<Job>(`/jobs/${id}`);
};

export const createOffer = async (payload: { jobId: string; driverId: string; ratePence: number }) => {
  return request<Offer>('/offers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const acceptOffer = async (offerId: string) => {
  return request<{ status: string }>(`/offers/${offerId}/accept`, {
    method: 'POST',
  });
};

export const setAvailability = async (driverId: string, state: string) => {
  return request<void>(`/drivers/${driverId}/availability`, {
    method: 'POST',
    body: JSON.stringify({ state }),
  });
};

export const postExchange = async (payload: {
  jobId: string;
  exchange: string;
  externalId: string;
}) => {
  const path = isMock ? '/exchange' : '/exchange-postings';
  return request<{ status: string }>(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
