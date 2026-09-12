# Frontend

React + Vite calculator UI. Sends expressions to the Go backend and displays results.

## Running locally

```sh
npm install
npm run dev
# http://localhost:5173
```

The dev server proxies `/calculate` to `http://localhost:8080` (configured in `vite.config.ts`), so the backend must be running.

## Environment variables

| Variable        | Description                                      | Default          |
|-----------------|--------------------------------------------------|------------------|
| `VITE_API_URL`  | Base URL of the backend (e.g. `http://api:8080`) | `""` (same-host) |

When `VITE_API_URL` is empty the fetch goes to `/calculate`, which nginx proxies to the backend container.

## Scripts

```sh
npm run dev      # start dev server with HMR
npm run build    # type-check + production build
npm run test     # run unit tests with vitest
npm run lint     # oxlint
```

## Design decisions

- **Expression built client-side** — the display holds the raw infix string (`2+5*3`); only on `=` / Enter is it sent to the backend. This avoids a round-trip per keystroke.
- **Validator helpers** (`src/validators.ts`) — `appendOperator`, `appendOpenParen`, `appendCloseParen` enforce expression grammar on each input, preventing obvious invalid states (double operators, unmatched parens) before the string ever reaches the API.
- **Keyboard support** — a `keydown` listener on `window` maps digit/operator keys, Enter, and Backspace, giving the same behaviour as button clicks.
- **`VITE_API_URL` build arg** — injected at build time so the static bundle can target any backend host without a runtime config file.
- **nginx** serves the production build; no Node process at runtime.

## Tests

```sh
npm run test
```

Unit tests cover the validator helpers and the main App component (fetch mocked).
