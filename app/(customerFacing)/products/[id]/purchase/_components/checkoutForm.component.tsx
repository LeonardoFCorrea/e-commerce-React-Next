"use client";

import { userOrderExists } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { LinkAuthenticationElement } from "@stripe/react-stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import React, { useState } from "react";

type CheckoutFormProps = {
  product: {
    id: string;
    name: string;
    priceCents: number;
    desc: string;
    imgPath: string;
  };
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string,
);

export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        <div className="aspect-video shrink-0 w-1/3 relative">
          <Image
            src={product.imgPath}
            fill
            alt={product.name}
            className="object-contain rounded-md border-1 border-zinc-300"
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
        </div>
      </div>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <Form priceCents={product.priceCents} productId={product.id} />
      </Elements>
    </div>
  );
}

function Form({
  priceCents,
  productId,
}: {
  priceCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || isLoading || !email) {
      return;
    }

    setIsLoading(true);

    const orderExists = await userOrderExists(email, productId);

    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product with this email.",
      );
      setIsLoading(false);
      return;
    }

    stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/stripe/purchase-success`,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border border-zinc-300">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <PaymentElement />
          <div className="mt-4"></div>
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value.email)}
          />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full cursor-pointer"
            size="lg"
            disabled={!stripe || !elements || isLoading}
          >
            {isLoading
              ? "Processing..."
              : `Complete Purchase - ${formatCurrency(priceCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
