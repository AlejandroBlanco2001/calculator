# Calculator

A calculator with a Go backend and a React frontend, containerised with Docker Compose (also compatible with Podman Compose).

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Go | 1.22 |
| Node | 20 |
| Docker + Compose v2 | 24 |

> Podman + podman-compose can be used in place of Docker.

## Architecture

```
┌─────────────────┐        POST /calculate        ┌──────────────────┐
│  React Frontend │ ────────────────────────────▶ │   Go Backend     │
│  (Vite + nginx) │                               │   (chi router)   │
│  :8081          │ ◀──────────────────────────── │   :8080          │
└─────────────────┘         { result }            └──────────────────┘
```

The frontend sends infix expressions typed by the user; the backend converts them to RPN via the Shunting-Yard algorithm and evaluates them.

## Running with Docker

```sh
docker compose up --build
```

Or with Podman:

```sh
podman compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:8081      |
| Backend  | http://localhost:8080      |

> The frontend is exposed on port `8081` instead of `80` so rootless Podman containers can bind it without elevated privileges. Docker works on either port.

To pass a custom backend URL to the frontend build (e.g. a remote host):

```sh
VITE_API_URL=http://api.example.com docker compose up --build
```

Without the variable the frontend proxies `/calculate` through nginx to the backend container.

## Design decisions

- **Shunting-Yard + RPN** — single-pass infix-to-RPN conversion keeps the evaluator simple and operator-precedence correct without a recursive parser.
- **float32** — sufficient precision for a calculator UI; avoids the verbosity of `big.Float`.
- **No auth / input sanitisation** — all inputs are math expressions produced by the UI; sanitisation would add noise with no security benefit.

## Running tests

```sh
# Backend
cd backend && go test ./...

# Frontend
cd frontend && npm run test
```

See [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md) for coverage reports.

## Services

- [`backend/`](backend/README.md) — Go HTTP service
- [`frontend/`](frontend/README.md) — React + Vite SPA

## AI prompts

The prompts used during development are documented in [`PROMPTS.md`](PROMPTS.md).
