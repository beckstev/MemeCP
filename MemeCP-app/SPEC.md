# MemeCP-app

## Value Proposition
MemeCP-app helps an AI assistant answer moments of user frustration, confusion, or strange conversational input with a fitting meme instead of a flat apology.

**Target users**: AI assistants and the people chatting with them, especially in casual or playful contexts.

**Pain**: Today the assistant usually replies with generic clarification text when it does not understand something. That can feel stiff when the conversation would benefit from a lighter response.

**Core action**: Generate one contextual meme reply from a short description of the moment.

## Why LLM?
**Conversational win**: The assistant can describe the exact awkward, frustrated, or confusing moment in natural language.

**LLM adds**: It detects tone, summarizes context, decides whether the moment is confusion, frustration, absurdity, or debugging pain, and can pass concise text for the meme.

**What LLM lacks**: A reliable way to pick standard meme templates, compose short overlay text, generate a meme image URL, and present the result visually.

## UI Overview
**First view**: A compact generated meme card with image preview, selected template, short rationale, and suggested reply text.

**Key interaction**: The assistant calls `generate_meme_reply` with conversation context, optional tone, and optional template preference. The view renders the generated meme and copy-ready response.

**End state**: The assistant can send the meme image URL or use the suggested reply text in the chat.

## Product Context
- **Existing product**: Skybridge MCP/ChatGPT app in this repository.
- **Meme image provider**: Memegen-style image URLs using standard public meme templates.
- **Auth**: None for the MVP.
- **Constraints**: Keep overlay text short, avoid hateful or targeted abuse, and use light humor rather than escalating user frustration.

## UX Flows
Generate a meme reply:
1. Assistant receives a confusing, frustrated, or unusual user moment.
2. Assistant calls `generate_meme_reply` with the context and optional tone/template.
3. App selects a standard meme template and creates context-fitting text.
4. App returns a meme image URL, template metadata, rationale, and suggested assistant reply.
5. View displays the meme and reply details.

## Tools and Views
**View: generate_meme_reply**
- **Input**: `{ context, userMessage?, assistantIssue?, tone?, templateHint? }`
- **Output**: `{ template, memeUrl, lines, suggestedReply, rationale }`
- **Views**: single inline meme result card.
- **Behavior**: reads structured output, displays image, and gives the assistant a reply-ready sentence.
