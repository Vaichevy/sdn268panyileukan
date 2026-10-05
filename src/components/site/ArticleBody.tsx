import { Linkify } from "@/components/site/Linkify";

/** Renders simple article text: "## " headings, "- " / "1. " list items, paragraphs. */
export function ArticleBody({ text }: { text?: string | null }) {
  const blocks = (text ?? "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-4 text-base leading-relaxed text-foreground/90">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        return (
          <div key={i} className="space-y-2">
            {lines.map((line, j) => {
              if (line.startsWith("## "))
                return (
                  <h2 key={j} className="pt-4 font-display text-2xl font-semibold text-foreground">
                    {line.slice(3)}
                  </h2>
                );
              const li = line.match(/^(-|\d+\.)\s+(.*)$/);
              if (li)
                return (
                  <p key={j} className="flex gap-2 pl-2">
                    <span className="shrink-0 font-semibold text-primary">
                      {li[1] === "-" ? "•" : li[1]}
                    </span>
                    <span>
                      <Linkify text={li[2]} />
                    </span>
                  </p>
                );
              return (
                <p key={j}>
                  <Linkify text={line} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
