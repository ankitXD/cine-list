import Link from "next/link";
import { Film, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

export const metadata = {
  title: "Page Not Found — Cine List",
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 flex items-center justify-center">
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-destructive/10">
                <Film className="h-6 w-6 text-destructive" />
              </EmptyMedia>
              <EmptyTitle>Cut! Scene Not Found</EmptyTitle>
              <EmptyDescription>
                Looks like this page is out of frame. The scene you are looking
                for does not exist in our directory.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="text-base font-medium text-foreground">
                  Error: 404
                </p>
                <p>
                  This page may have been removed, or you may have mistyped the
                  URL. No worries, let us get you back on track!
                </p>
              </div>
              <Button asChild size="lg" className="mt-6">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </main>
      <Footer />
    </div>
  );
}
