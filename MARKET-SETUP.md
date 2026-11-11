# Market data credentials and deployment

## TradingView
The TradingView Forex Table is an official public embed and does **not** require a key. It loads from TradingView and has its own data refresh and display policies.

## Twelve Data
Twelve Data's documented `apikey=demo` is a limited demonstration credential, **not a production or general-purpose streaming key**. It must not be represented as live access. A personal account key is required for full functionality, and WebSocket access is subject to plan and trial-symbol restrictions.

1. Create your own Twelve Data account and API key at https://twelvedata.com/.
2. Add it to GitHub repository **Settings → Secrets and variables → Actions → New repository secret** named `TWELVEDATA_API_KEY`, if you want the GitHub Actions readiness workflow to validate it.
3. Run **Actions → Market gateway readiness → Run workflow**. The workflow never prints the key.
4. Separately configure the *actual running gateway* with the same secret using its hosting platform's secret manager or a protected systemd environment file. GitHub Pages cannot access Actions secrets and cannot run Node.js.
5. Deploy `market-gateway.js` on Node.js 22+ with `TWELVEDATA_API_KEY`, `MARKET_ORIGIN=https://floresta-web.github.io`, and an HTTPS reverse proxy to localhost port 8787.
6. Enter the HTTPS endpoint ending in `/market/stream` in the Market Tree's gateway field.

The stream is deliberately not enabled without an authorized key and a running gateway. No third-party credentials are copied or shared. Confirm the provider's public display/redistribution terms before serving quotes to the public.

References:
- https://twelvedata.com/docs/websocket/websocket-getting-started
- https://www.tradingview.com/widget-docs/widgets/heatmaps/forex-heatmap/
