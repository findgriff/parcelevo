import { NextResponse } from 'next/server';
import { listJobsByStatus } from '@/lib/mock-store';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') ?? 'created') as
    | 'created'
    | 'offered'
    | 'accepted';
  const jobs = listJobsByStatus(status);
  return NextResponse.json(jobs);
};
