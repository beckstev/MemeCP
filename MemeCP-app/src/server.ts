import { McpServer } from "skybridge/server";
import { z } from "zod";

type MemeTemplate = {
  id: string;
  name: string;
  bestFor: string;
  keywords: string[];
  buildLines: (input: MemeInput) => [string, string];
};

type MemeInput = {
  context: string;
  userMessage?: string;
  assistantIssue?: string;
  tone: "playful" | "dry" | "supportive" | "chaotic";
  templateHint?: string;
};

const fallbackText = "this conversation";

const templates: MemeTemplate[] = [
  {
    id: "drake",
    name: "Drake Hotline Bling",
    bestFor: "rejecting a stiff assistant reply and choosing a meme instead",
    keywords: ["apology", "generic", "stiff", "boring", "clarify", "confused"],
    buildLines: ({ assistantIssue }) => [
      shortLine(assistantIssue ?? "generic clarification loop"),
      "context-aware meme reply",
    ],
  },
  {
    id: "both",
    name: "Why Not Both?",
    bestFor: "the assistant can acknowledge confusion and still make it funny",
    keywords: ["choice", "decide", "either", "both", "panic", "unsure"],
    buildLines: ({ context }) => [
      "ask a normal follow-up",
      shortLine(`turn "${context}" into a meme`),
    ],
  },
  {
    id: "ds",
    name: "Distracted Boyfriend",
    bestFor: "attention drifting from useful context to a chaotic detail",
    keywords: ["weird", "random", "unexpected", "chaotic", "strange", "odd"],
    buildLines: ({ userMessage }) => [
      "the assistant",
      shortLine(userMessage ?? "that one weird detail"),
    ],
  },
  {
    id: "fine",
    name: "This Is Fine",
    bestFor: "frustration, errors, or the conversation catching fire",
    keywords: ["frustrated", "angry", "error", "broken", "bug", "fail", "wtf"],
    buildLines: ({ context }) => [
      "the context is on fire",
      shortLine(context),
    ],
  },
  {
    id: "awkward",
    name: "Awkward Moment Sealion",
    bestFor: "the assistant admits it needs a little more signal",
    keywords: ["understand", "unknown", "ambiguous", "unclear", "lost"],
    buildLines: ({ userMessage }) => [
      "when the user says",
      shortLine(userMessage ?? fallbackText),
    ],
  },
  {
    id: "spongebob",
    name: "Mocking SpongeBob",
    bestFor: "lightly mirroring an absurd phrasing without being mean",
    keywords: ["sarcastic", "absurd", "silly", "nonsense", "caps"],
    buildLines: ({ userMessage }) => [
      "the model trying to parse",
      alternatingCase(shortLine(userMessage ?? fallbackText)),
    ],
  },
];

const server = new McpServer(
  {
    name: "MemeCP-app",
    version: "0.0.1",
  },
  { capabilities: {} },
)
  .registerTool(
    {
      name: "generate_meme_reply",
      description:
        "Generate a contextual meme reply for moments where a user is frustrated, says something weird, or the assistant does not understand.",
      inputSchema: {
        context: z
          .string()
          .min(1)
          .describe(
            "A concise description of the confusing, frustrating, or weird conversational moment.",
          ),
        userMessage: z
          .string()
          .optional()
          .describe("The user's exact message, if useful for meme text."),
        assistantIssue: z
          .string()
          .optional()
          .describe(
            "What the assistant is struggling with, such as missing context or unclear intent.",
          ),
        tone: z
          .enum(["playful", "dry", "supportive", "chaotic"])
          .optional()
          .describe("The desired humor style. Defaults to playful."),
        templateHint: z
          .string()
          .optional()
          .describe("Optional preferred meme template name or style."),
      },
      annotations: {
        title: "Generate meme reply",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
      _meta: {
        "openai/toolInvocation/invoking": "Finding the right meme energy...",
        "openai/toolInvocation/invoked": "Meme reply ready.",
      },
      view: {
        component: "meme-reply",
        description: "Contextual meme reply preview",
        csp: {
          resourceDomains: [
            "https://api.memegen.link",
            "https://fonts.googleapis.com",
            "https://fonts.gstatic.com",
          ],
        },
      },
    },
    async (rawInput) => {
      const input: MemeInput = {
        context: rawInput.context,
        userMessage: rawInput.userMessage,
        assistantIssue: rawInput.assistantIssue,
        tone: rawInput.tone ?? "playful",
        templateHint: rawInput.templateHint,
      };
      const template = chooseTemplate(input);
      const lines = template.buildLines(input);
      const memeUrl = buildMemegenUrl(template.id, lines);
      const suggestedReply = buildSuggestedReply(input, memeUrl);
      const rationale = `Picked ${template.name} because it is good for ${template.bestFor}.`;

      return {
        structuredContent: {
          template: {
            id: template.id,
            name: template.name,
            bestFor: template.bestFor,
          },
          lines,
          memeUrl,
          suggestedReply,
          rationale,
        },
        content: [
          {
            type: "text",
            text: `${suggestedReply}\n\nMeme: ${memeUrl}`,
          },
        ],
        isError: false,
      };
    },
  );

if (process.env.NODE_ENV === "production") {
  const { default: manifest } = await import("./vite-manifest.js");
  server.setViteManifest(manifest);
}

export default await server.run();

export type AppType = typeof server;

function chooseTemplate(input: MemeInput) {
  const hint = input.templateHint?.toLowerCase().trim();
  if (hint) {
    const hinted = templates.find(
      (template) =>
        template.id.includes(hint) ||
        template.name.toLowerCase().includes(hint),
    );
    if (hinted) return hinted;
  }

  const haystack = [
    input.context,
    input.userMessage,
    input.assistantIssue,
    input.tone,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    templates
      .map((template) => ({
        template,
        score: template.keywords.reduce(
          (score, keyword) => score + (haystack.includes(keyword) ? 1 : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score)[0]?.template ?? templates[0]
  );
}

function buildMemegenUrl(templateId: string, lines: [string, string]) {
  const encodedLines = lines.map((line) => encodeMemeSegment(line)).join("/");
  return `https://api.memegen.link/images/${templateId}/${encodedLines}.png`;
}

function encodeMemeSegment(value: string) {
  const safe = value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
    .replace(/\?/g, "~q")
    .replace(/#/g, "~h")
    .replace(/\//g, "~s");

  return encodeURIComponent(safe || fallbackText).replace(/%20/g, "_");
}

function shortLine(value: string) {
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= 52) return compact || fallbackText;
  return `${compact.slice(0, 49).trim()}...`;
}

function alternatingCase(value: string) {
  return value
    .split("")
    .map((char, index) =>
      index % 2 === 0 ? char.toLowerCase() : char.toUpperCase(),
    )
    .join("");
}

function buildSuggestedReply(input: MemeInput, memeUrl: string) {
  const intros = {
    playful: "I may need one more clue, but the current vibe is this:",
    dry: "Diagnostic result: the conversation has entered meme territory.",
    supportive: "I get the frustration. Let me lighten the moment while I recalibrate:",
    chaotic: "The parser has left the chat, so I brought a meme:",
  } satisfies Record<MemeInput["tone"], string>;

  return `${intros[input.tone]} ${memeUrl}`;
}
