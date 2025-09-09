Railway service configuration for the bot
=======================================

When you create a Railway service for the bot, point the service root to the `bot/` directory and use the commands below.

Recommended settings
- Root directory: `/bot`
- Build command: `npm ci && npm run build`
- Start command: `npm run start`

Notes
- The project uses a monorepo workspace. Railway should run install from the `bot/` folder so the workspace-local `node_modules` are populated.
- We intentionally gated the legacy converter. Do NOT run `npm run legacy-build` in CI; it's kept under `bot/legacy/` for reference only.
- The `build` script now runs the TypeScript project build (`tsc -b`) which emits `dist/` to `bot/dist`.

Troubleshooting
- If Railway fails with missing packages, ensure `package-lock.json` is committed at the repository root and Railway runs `npm ci` at repo root before building workspaces (or configure Railway to run `npm ci` from root). The included `railpack-plan.json` can help orchestrate that.
- If your Railway service expects a single start command, use: `npm run start --workspace=bot`

Example: minimal railpack plan for a bot-only service
----------------------------------------------------
{
  "$schema": "https://schema.railpack.com",
  "startCommand": "npm run start --workspace=bot",
  "steps": [
    { "name": "install", "commands": ["npm ci"] },
    { "name": "build",   "commands": ["npm run build --workspace=bot"] }
  ]
}
