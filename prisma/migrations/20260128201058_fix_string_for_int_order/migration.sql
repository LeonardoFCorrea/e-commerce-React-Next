/*
  Warnings:

  - Changed the type of `pricePaidCents` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "pricePaidCents",
ADD COLUMN     "pricePaidCents" INTEGER NOT NULL;
