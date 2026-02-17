import { notFound } from "next/navigation";
import Stripe from "stripe";
import db from "@/db/db";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string }>;
}) {
  const { payment_intent: paymentIntentId } = await searchParams;

  if (!paymentIntentId) {
    console.error("ID do Payment Intent não encontrado na URL");
    return notFound();
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  const productId = paymentIntent.metadata?.productId;

  if (!productId) {
    return <div>Pagamento confirmado, mas produto não identificado.</div>;
  }

  const product = await db.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return <div>Produto não encontrado no banco.</div>;
  }

  const isSuccessful = paymentIntent.status === "succeeded";

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccessful
          ? "Thank you for your purchase!"
          : "Your payment is being processed."}
      </h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video shrink-0 w-1/3 relative">
          <Image
            src={product.imgPath}
            fill
            alt={product.name}
            className="object-contain rounded-md border border-zinc-300"
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.desc}
          </div>
          <Button className="mt-4" size="lg" asChild>
            {isSuccessful ? (
              <a
                href={`/products/download/${await createDownloadVerification(product.id)}`}
              >
                Download Product
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  return await db.downloadVerification
    .create({
      data: {
        productId,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
    .then((record) => record.id);
}
