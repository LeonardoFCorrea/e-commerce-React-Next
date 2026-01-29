import db from "@/db/db";
import { PageHeader } from "../../../_components/pageHeader";
import { ProductForm } from "../../_components/productForm";
import { notFound } from "next/navigation";

export default async function EditProductPage(props: any) {
  const { id } = await props.params; // ✅ await aqui

  if (!id) {
    return notFound();
  }

  const product = await db.product.findUnique({
    where: { id }, // UUID
  });

  if (!product) return notFound();

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
