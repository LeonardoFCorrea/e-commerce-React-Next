"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";

export function ProductForm() {
  const [priceCents, setPriceCents] = useState<number>();
  return (
    <form action="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceCents">Price (Cents)</Label>
        <Input
          type="number"
          id="priceCents"
          name="priceCents"
          required
          value={priceCents}
          onChange={(e) => setPriceCents(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceCents || 0) / 100)}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="productFile">Product File</Label>
        <Input type="file" id="productFile" name="productFile" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageFile">Product File</Label>
        <Input type="file" id="imageFile" name="imageFile" required />
      </div>
    </form>
  );
}
