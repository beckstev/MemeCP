import "@/index.css";

import { Copy, ExternalLink, Sparkles } from "lucide-react";
import { useLayout } from "skybridge/web";
import { toast, Toaster } from "sonner";
import { useToolInfo } from "../helpers.js";

export default function MemeReply() {
  const { theme } = useLayout();
  const { input, output, isPending } = useToolInfo<"generate_meme_reply">();
  const isDark = theme === "dark";

  if (isPending || !output) {
    return (
      <main className={isDark ? "dark" : ""}>
        <section className="mx-auto w-full max-w-3xl border border-border bg-background p-5 text-foreground">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border border-border bg-muted">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Choosing meme energy</p>
              <p className="text-xs text-muted-foreground">
                Reading the context and matching a template.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const copyReply = async () => {
    await navigator.clipboard.writeText(output.suggestedReply);
    toast.success("Reply copied");
  };

  return (
    <main className={isDark ? "dark" : ""}>
      <Toaster richColors theme={isDark ? "dark" : "light"} />
      <section className="mx-auto w-full max-w-3xl overflow-hidden border border-border bg-background text-foreground">
        <div className="grid gap-4 p-4 md:grid-cols-[minmax(220px,0.88fr)_1fr]">
          <figure className="overflow-hidden border border-border bg-muted">
            <img
              src={output.memeUrl}
              alt={`${output.template.name} meme`}
              className="aspect-square w-full object-contain"
            />
          </figure>

          <div className="flex min-w-0 flex-col gap-4">
            <header className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  MemeCP reply
                </p>
                <h1 className="text-xl font-semibold leading-tight">
                  {output.template.name}
                </h1>
              </div>
              <a
                href={output.memeUrl}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 shrink-0 place-items-center border border-border bg-background hover:bg-muted"
                aria-label="Open meme image"
                title="Open meme image"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </header>

            <div className="grid gap-2">
              {output.lines.map((line, index) => (
                <div key={`${line}-${index}`} className="border border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    Line {index + 1}
                  </p>
                  <p className="break-words text-sm font-medium">{line}</p>
                </div>
              ))}
            </div>

            <div className="border border-border bg-muted/40 p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Suggested reply
              </p>
              <p className="break-words text-sm leading-relaxed">
                {output.suggestedReply}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
                {output.rationale}
              </p>
              <button
                type="button"
                onClick={copyReply}
                className="inline-flex h-9 items-center gap-2 border border-border bg-foreground px-3 text-sm font-medium text-background hover:opacity-90"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
          </div>
        </div>

        {input?.context ? (
          <div className="border-t border-border px-4 py-3">
            <p className="truncate text-xs text-muted-foreground">
              Context: {input.context}
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
