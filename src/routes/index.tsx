import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QUOTES, randomIndex } from "@/lib/quotes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daily Quote — Random Quote Generator" },
      { name: "description", content: "A fresh, inspiring quote every time you visit or click." },
      { property: "og:title", content: "Daily Quote — Random Quote Generator" },
      { property: "og:description", content: "A fresh, inspiring quote every time you visit or click." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [index, setIndex] = useState<number | null>(null);
  useEffect(() => setIndex(randomIndex(QUOTES.length)), []);
  const quote = index === null ? null : QUOTES[index];

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-2xl text-center">
        <p className="mb-10 text-xs uppercase tracking-[0.3em] text-muted-foreground">Quote of the moment</p>
        <div key={index ?? -1} className="min-h-48 animate-in fade-in duration-500">
          {quote && (
            <>
              <blockquote className="font-serif text-3xl leading-snug text-foreground md:text-5xl">
                “{quote.text}”
              </blockquote>
              <p className="mt-8 text-base text-primary">— {quote.author}</p>
            </>
          )}
        </div>
        <button
          onClick={() => setIndex((i) => randomIndex(QUOTES.length, i ?? undefined))}
          className="mt-12 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-95"
        >
          New Quote
        </button>
      </div>
    </main>
  );
}
