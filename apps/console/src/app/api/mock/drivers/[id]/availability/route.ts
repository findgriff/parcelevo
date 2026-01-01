import { NextResponse } from 'next/server';
import { availability } from '@/lib/mock-store';

export const POST = async (request: Request, context: { params: { id: string } }) => {
  const body = (await request.json()) as { state: string };
  availability.set(context.params.id, body.state);
  return new NextResponse(null, { status: 204 });
};
