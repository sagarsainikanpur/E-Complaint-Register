
import { HomePageClient } from "@/components/home-page-client";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline tracking-tight">
          SignAssist
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Your digital complaint and signature solution. Capture issues, solutions, and signatures seamlessly.
        </p>
      </div>

      <HomePageClient />
    </main>
  );
}
