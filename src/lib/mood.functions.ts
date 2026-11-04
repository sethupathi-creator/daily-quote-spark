import { createServerFn } from "@tanstack/react-start";
import { generateResponse, GatewayError } from "@lovable.dev/ai-gateway";
import { QUOTES } from "@/lib/quotes";

function extractText(response: unknown): string | null {
  const output = (response as { output?: unknown }).output;
  if (!Array.isArray(output)) return null;
  for (const item of output) {
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      const p = part as { type?: string; text?: string };
      if (p.type === "output_text" && typeof p.text === "string") return p.text;
    }
  }
  return null;
}

export const matchQuoteToMood = createServerFn({ method: "POST" })
  .inputValidator((input: { mood: string }) => {
    const mood = typeof input?.mood === "string" ? input.mood.trim() : "";
    if (!mood) throw new Error("Please describe your mood first.");
    return { mood: mood.slice(0, 200) };
  })
  .handler(async ({ data }) => {
    const catalogue = QUOTES.map((q, i) => `${i}. "${q.text}" — ${q.author}`).join("\n");
    try {
      const response = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions:
          "You pick the single most fitting quote for a person's mood from a fixed, numbered list. " +
          "Reply with JSON only: {\"index\": <number>}. The index must be one of the list numbers.",
        input: `Mood: "${data.mood}"\n\nQuotes:\n${catalogue}\n\nReturn JSON with the index of the best-matching quote.`,
        text: {
          format: {
            type: "json_schema",
            name: "quote_match",
            strict: true,
            schema: {
              type: "object",
              properties: { index: { type: "integer" } },
              required: ["index"],
              additionalProperties: false,
            },
          },
        },
      });
      const text = extractText(response);
      const parsed = text ? (JSON.parse(text) as { index?: unknown }) : null;
      const index = typeof parsed?.index === "number" ? Math.trunc(parsed.index) : -1;
      if (index < 0 || index >= QUOTES.length) throw new Error("out_of_range");
      return { index };
    } catch (error) {
      if (error instanceof GatewayError) {
        console.error("Mood match failed", error.code, error.ids);
      }
      throw new Error("Couldn't match a quote right now. Try again.");
    }
  });
