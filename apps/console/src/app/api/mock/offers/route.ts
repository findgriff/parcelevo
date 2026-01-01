import { NextResponse } from 'next/server';
import { addOffer, getJob } from '@/lib/mock-store';

export const POST = async (request: Request) => {
  const body = (await request.json()) as {
    jobId: string;
    driverId: string;
    ratePence: number;
  };

  const job = getJob(body.jobId);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const offer = {
    id: `offer_${Date.now()}`,
    jobId: body.jobId,
    driverId: body.driverId,
    ratePence: body.ratePence,
    status: 'pending' as const,
    expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
  };

  addOffer(offer);
  return NextResponse.json(offer, { status: 201 });
};
