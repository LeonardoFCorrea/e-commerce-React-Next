import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
    id: string;
    name: string;
    priceCents: number;
    desc: string;
    imgPath: string;
};

export function ProductCard({ name, priceCents, desc, imgPath, id }: ProductCardProps) {
    return (
        <Card className="flex overflow-hidden flex-col">
            <div className="relative w-full h-auto aspect-video">
                <Image src={imgPath} fill alt={name} />
            </div>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{formatCurrency(priceCents / 100)}</CardDescription>
            </CardHeader>
            <CardContent className="grow">
                <p className="line-clamp-4">{desc}</p>
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full">
                    <Link href={`/products/${id}/purchase`}>Purchase</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}