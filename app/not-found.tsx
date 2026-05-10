import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-16 text-center">
      <div>
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          That page is not in the toolkit yet.
        </p>
        <Button asChild className="mt-6">
          <Link href="/tools">Browse tools</Link>
        </Button>
      </div>
    </div>
  );
}
