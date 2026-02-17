import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ExpiredDownloadPage() {
    return (
        <>
        <h1 className="text-4xl mb-4">Download Expired</h1>
        <Button size="lg" asChild>
            <Link href="/orders">Get New Download Link</Link>
        </Button>
        </>
    );
}