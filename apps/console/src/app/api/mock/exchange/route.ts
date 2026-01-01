import { NextResponse } from 'next/server';
import { setExchange } from '@/lib/mock-store';

export const POST = async (request: Request) => {
  const body = (await request.json()) as {
    jobId: string;
    exchange: string;
    externalId: string;
  };

  setExchange(body.jobId, body.exchange, body.externalId);
  return NextResponse.json({ status: 'ok' });
};
