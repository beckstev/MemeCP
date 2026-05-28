# MemeCP-app

MemeCP-app is a Skybridge MCP app that helps an AI assistant respond to frustrating, confusing, or strange conversation moments with a fitting meme.

The app exposes a `generate_meme_reply` tool. The assistant sends conversation context, and the app returns:

- a standard meme template choice
- generated meme image URL
- overlay text
- a short rationale
- copy-ready assistant reply text

## Getting Started

### Prerequisites

- Node.js 24+

### Local Development

#### 1. Install

```bash
npm install
# or
pnpm install
# or
bun install
# or
deno install
# or
yarn install
```

#### 2. Start your local server

Run the development server from the root directory:

```bash
npm run dev
# or
pnpm dev
# or
bun dev
# or
deno task dev
# or
yarn dev
```

This command starts the MCP server at `http://localhost:3000/mcp` and Skybridge DevTools at `http://localhost:3000`.

#### 3. Project structure

```
├── src/
│   ├── server.ts         # Server entry point
│   ├── views/            # React components (one per view)
│   ├── components/       # Shared UI components
│   ├── helpers.ts        # Shared utilities
│   └── index.css         # Global styles
├── vite.config.ts
├── alpic.json            # Deployment config
└── package.json
```

### Testing your App

You can test your app locally by using our DevTools UI on `http://localhost:3000` while running the `dev` command.

To connect your app with web clients like ChatGPT or Claude, expose your server on the internet by adding the `--tunnel` flag.
By enabling the tunnel, you'll also be able to access a playground to chat with your app and a real LLM. Learn more by reading the [test guide](https://docs.skybridge.tech/quickstart/test-your-app).


## Deploy to Production

Skybridge is infrastructure vendor agnostic, and your app can be deployed on any cloud platform supporting MCP.

The simplest way to deploy your app is by running the `deploy` command, which will push your MCP server to the [Alpic](https://alpic.ai/) cloud for free.

## Resources
- [Skybridge Documentation](https://docs.skybridge.tech/)
- [Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [MCP Apps Documentation](https://github.com/modelcontextprotocol/ext-apps/tree/main)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Alpic Documentation](https://docs.alpic.ai/)
