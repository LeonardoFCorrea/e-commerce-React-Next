import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ downloadVerification: string }> },
) {
  const { downloadVerification } = await params;

  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerification, expiredAt: { gt: new Date() } },
    select: {
      product: {
        select: {
          name: true,
          filePath: true,
        },
      },
    },
  });

  if (!data) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url),
    );
  }

  const { size } = await fs.stat(data.product.filePath);
  const extension = data.product.filePath.split(".").pop();

  const fileStream = fsSync.createReadStream(data.product.filePath);

  return new NextResponse(fileStream as any, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
      "Content-Length": size.toString(),
      "Content-Type": "application/octet-stream",
    },
  });
}
