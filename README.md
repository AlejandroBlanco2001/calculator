# Calculadora

A calculator with a Go backend and a React frontend, containerised with Podman Compose.

## Architecture

```
┌─────────────────┐        POST /calculate        ┌──────────────────┐
│  React Frontend │ ────────────────────────────▶ │   Go Backend     │
│  (Vite + nginx) │                               │   (chi router)   │
│  :8081          │ ◀──────────────────────────── │   :8080          │
└─────────────────┘         { result }            └──────────────────┘
```

The frontend sends infix expressions typed by the user; the backend converts them to RPN via the Shunting-Yard algorithm and evaluates them.

## Running with Podman

```sh
podman compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:8081      |
| Backend  | http://localhost:8080      |

To pass a custom backend URL to the frontend build (e.g. a remote host):

```sh
VITE_API_URL=http://api.example.com podman compose up --build
```

Without the variable the frontend proxies `/calculate` through nginx to the backend container.

## Design decisions

- **Shunting-Yard + RPN** — single-pass infix-to-RPN conversion keeps the evaluator simple and operator-precedence correct without a recursive parser.
- **float32** — sufficient precision for a calculator UI; avoids the verbosity of `big.Float`.
- **No auth / input sanitisation** — all inputs are math expressions produced by the UI; sanitisation would add noise with no security benefit.
- **Rootless Podman** — frontend exposed on port `8081` instead of `80` because rootless containers cannot bind privileged ports.

## Services

- [`backend/`](backend/README.md) — Go HTTP service
- [`frontend/`](frontend/README.md) — React + Vite SPA
