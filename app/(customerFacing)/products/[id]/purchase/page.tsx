export const dynamic = "force-dynamic";

import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { CheckoutForm } from "./_components/checkoutForm.component";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface PurchasePageProps {
  params: Promise<{ id: string }>;
}

export default async function PurchasePage({ params }: PurchasePageProps) {
  const { id } = await params;

  console.log("ID recuperado:", id);

  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceCents,
    currency: "usd",
    metadata: {
      productId: product.id,
    },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Failed to create payment intent");
  }

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
