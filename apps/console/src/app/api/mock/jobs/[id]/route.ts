import { NextResponse } from 'next/server';
import { getJob } from '@/lib/mock-store';

export const GET = async (_request: Request, context: { params: { id: string } }) => {
  const job = getJob(context.params.id);
  if (!job) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(job);
};
