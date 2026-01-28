"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.coerce.number().int().min(1, {message: "Number must be greater or equal to 0"}),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    console.log("ERROS:", result.error.flatten().fieldErrors);

    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir("public/products", { recursive: true });
  const imgPath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public${imgPath}`,
    Buffer.from(await data.image.arrayBuffer()),
  );

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      desc: data.description,
      priceCents: data.priceCents,
      filePath,
      imgPath,
    },
  });

  redirect("/admin/products");
}
