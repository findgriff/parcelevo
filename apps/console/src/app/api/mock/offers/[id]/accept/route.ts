import { NextResponse } from 'next/server';
import { acceptOffer } from '@/lib/mock-store';

export const POST = async (_request: Request, context: { params: { id: string } }) => {
  acceptOffer(context.params.id);
  return NextResponse.json({ status: 'accepted' });
};
