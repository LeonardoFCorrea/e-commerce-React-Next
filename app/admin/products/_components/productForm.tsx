"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useActionState, useState } from "react";
import { addProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";

export function ProductForm() {
  const [priceCents, setPriceCents] = useState<string>("");
  const [error, formAction] = useActionState(addProduct, {
    errors: {},
  });
  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
        {error?.errors?.name?.map((err, i) => (
          <div key={i} className="text-destructive">
            {err}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceCents">Price (Cents)</Label>
        <Input
          type="number"
          id="priceCents"
          name="priceCents"
          required
          value={priceCents}
          onChange={(e) => setPriceCents(e.target.value)}
        />
        <div className="text-muted-foreground">
          {formatCurrency((Number(priceCents) || 0) / 100)}
        </div>
        {error?.errors?.priceCents?.map((err, i) => (
          <div key={i} className="text-destructive">
            {err}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
        {error?.errors?.description?.map((err, i) => (
          <div key={i} className="text-destructive">
            {err}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">Product File</Label>
        <Input type="file" id="file" name="file" required />
        {error?.errors?.file?.map((err, i) => (
          <div key={i} className="text-destructive">
            {err}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required />
        {error?.errors?.image?.map((err, i) => (
          <div key={i} className="text-destructive">
            {err}
          </div>
        ))}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add Product"}
    </Button>
  );
}
