import { Header } from '@/components/header';

export default function AboutUs() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Information about the company will go here.
          </p>
        </div>
      </main>
    </div>
  );
}
