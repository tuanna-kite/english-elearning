import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature') as string;
    const event: Stripe.Event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;
    if (event.type === 'checkout.session.completed') {
      if (!userId || !courseId) {
        return new NextResponse('Invalid metadata', { status: 400 });
      }

      await db.purchase.create({
        data: {
          userId,
          courseId,
        },
      });
    } else {
      return new NextResponse(`Invalid event type: ${event.type}`, {
        status: 200,
      });
    }
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log('[WEBHOOK]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
