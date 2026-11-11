# Floresta Telegram webhook service

Deploy this folder as a standalone Vercel project (Root Directory: `bot-service`).

Production encrypted environment variables:
- `TELEGRAM_BOT_TOKEN` — Telegram bot API token
- `TELEGRAM_WEBHOOK_SECRET` — random 32+ character URL-safe secret used in `X-Telegram-Bot-Api-Secret-Token`
- `TELEGRAM_GROUP_CHAT_ID` — numeric approved group ID
- `TELEGRAM_BOT_USERNAME` — optional bot username, without @

After production deployment and setting variables, register the webhook using the Telegram Bot API `setWebhook` with URL `https://<vercel-host>/api/telegram` and `secret_token` equal to `TELEGRAM_WEBHOOK_SECRET`. Never pass secrets in command-line arguments, browser scripts or public GitHub logs. A webhook takes over from `getUpdates`; the discovery workflow will then stop working.

The service only replies to commands or direct bot mentions in the authorized group. `/github` selects GitHub-specific conversational context, but Telegram messages are always labelled as Telegram-origin; actual GitHub event authentication remains in GitHub Actions. This is a routing scaffold, not an LLM-backed chatbot. Production operation needs encrypted environment variables and webhook registration.
