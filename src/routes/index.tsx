import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { QUOTES, randomIndex } from "@/lib/quotes";
import { matchQuoteToMood } from "@/lib/mood.functions";

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
  const [mood, setMood] = useState("");
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const matchMood = useServerFn(matchQuoteToMood);

  useEffect(() => setIndex(randomIndex(QUOTES.length)), []);
  const quote = index === null ? null : QUOTES[index];

  async function onMatch(e: React.FormEvent) {
    e.preventDefault();
    if (!mood.trim() || matching) return;
    setMatching(true);
    setError(null);
    try {
      const result = await matchMood({ data: { mood } });
      setIndex(result.index);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't match a quote right now. Try again.");
    } finally {
      setMatching(false);
    }
  }

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
        <form onSubmit={onMatch} className="mx-auto mt-10 flex max-w-md items-center gap-2">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="How are you feeling?"
            aria-label="Your mood"
            maxLength={200}
            className="w-full rounded-full border border-input bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={matching || !mood.trim()}
            className="shrink-0 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-accent disabled:opacity-50"
          >
            {matching ? "Matching…" : "Match my mood"}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </div>
    </main>
  );
}
