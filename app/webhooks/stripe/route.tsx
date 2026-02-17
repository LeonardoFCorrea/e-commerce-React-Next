import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    const signature = request.headers.get("stripe-signature") as string;

    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );

    console.log("🔔 Evento recebido:", event.type);

    if (event.type === "charge.succeeded") {
      const charge = event.data.object as Stripe.Charge;

      let productId = charge.metadata?.productId;
      const email = charge.billing_details?.email;
      const pricePaidCents = charge.amount;

      if (!productId && charge.payment_intent) {
        console.log("🔍 Buscando productId no PaymentIntent...");
        const paymentIntent = await stripe.paymentIntents.retrieve(
          charge.payment_intent as string,
        );
        productId = paymentIntent.metadata?.productId;
      }

      console.log("📊 Dados extraídos:", { productId, email, pricePaidCents });

      if (!productId || !email) {
        console.error("❌ Dados insuficientes para processar a ordem");
        return new NextResponse("Dados insuficientes", { status: 400 });
      }

      const product = await db.product.findUnique({ where: { id: productId } });
      if (!product) {
        console.error(`❌ Produto ${productId} não encontrado no banco`);
        return new NextResponse("Produto não existe", { status: 400 });
      }

      const user = await db.user.upsert({
        where: { email },
        create: { email },
        update: { email },
      });

      const order = await db.order.create({
        data: {
          userId: user.id,
          productId: product.id,
          pricePaidCents: pricePaidCents,
        },
      });

      const downloadVerification = await db.downloadVerification.create({
        data: {
          productId,
          expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      try {
        console.log(`📧 Tentando enviar email para ${email}...`);
        await resend.emails.send({
          from: `Support <${process.env.SENDER_EMAIL}>`,
          to: `leonardofelixcorrea@gmail.com`,
          subject: `Your download link for ${product.name}`,
          react: (
            <div>
              <h1>Thank you for your purchase!</h1>
              <p>Order ID: {order.id}</p>
              <p>Product: {product.name}</p>
              <a
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerification.id}`}
              >
                Click here to download your product
              </a>
            </div>
          ),
        });
        console.log("✅ Email enviado com sucesso via Resend!");
      } catch (emailError: any) {
        console.error("❌ Erro interno do Resend:", emailError.message);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err: any) {
    console.error("🔥 Webhook Error crítico:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
