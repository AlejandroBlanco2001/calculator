# Backend

Go HTTP service that evaluates math expressions. Uses [chi](https://github.com/go-chi/chi) for routing.

## Running locally

```sh
go run ./cmd
# listening on :8080
```

## API

### `POST /calculate`

Evaluates an infix math expression.

**Request**

```json
{ "expression": "2+5*3" }
```

**Response 200**

```json
{ "result": 17 }
```

**Response 400** — plain-text error message, e.g.:

```
Division by Zero
Negative square root
mismatched parentheses
```

### Examples

```sh
# Basic arithmetic
curl -X POST http://localhost:8080/calculate \
  -H 'Content-Type: application/json' \
  -d '{"expression": "2+5*3"}'
# {"result":17}

# Exponent
curl -X POST http://localhost:8080/calculate \
  -d '{"expression": "2^10"}' -H 'Content-Type: application/json'
# {"result":1024}

# Square root
curl -X POST http://localhost:8080/calculate \
  -d '{"expression": "√9"}' -H 'Content-Type: application/json'
# {"result":3}

# Percentage
curl -X POST http://localhost:8080/calculate \
  -d '{"expression": "50%"}' -H 'Content-Type: application/json'
# {"result":0.5}

# Parentheses
curl -X POST http://localhost:8080/calculate \
  -d '{"expression": "(1+2)*4"}' -H 'Content-Type: application/json'
# {"result":12}
```

## Supported operators

| Symbol | Operation      | Precedence | Associativity |
|--------|----------------|-----------|---------------|
| `+`    | Addition       | 1         | Left          |
| `-`    | Subtraction    | 1         | Left          |
| `*`    | Multiplication | 2         | Left          |
| `/`    | Division       | 2         | Left          |
| `%`    | Percentage     | 2         | Unary         |
| `^`    | Exponentiation | 3         | Right         |
| `√`    | Square root    | 4         | Unary         |

## Design decisions

- **Shunting-Yard algorithm** (`evaluator.go`) — converts infix to RPN in a single linear pass; handles precedence and associativity without a recursive-descent parser.
- **Separate operation functions** (`operations.go`) — each operator is an independent function with its own error path, making it trivial to add new operators.
- **float32** — adequate for a UI calculator; errors from division by zero and negative square roots are caught explicitly before the math call.
- **Extending operators** — add an entry to the `precedence` map in `evaluator.go`, implement the function in `operations.go`, and add a `case` in the `EvaluateRPN` switch.

## Tests & coverage

```sh
go test ./...                                              # run tests
go test -coverprofile=coverage.out ./... \
  && go tool cover -html=coverage.out -o coverage.html   # coverage report
```

Or via the Makefile (if `make` is available):

```sh
make test      # run tests
make coverage  # run tests + generate coverage.html
```

The HTML report is written to `coverage.html`. Note: tests live in the separate `tests/` package, so the Go toolchain reports `0%` for `calculadora/backend` itself — the functions are exercised but the coverage attribution only appears for `calculadora/backend/cmd` (HTTP handler at **89.5%**). `main()` is excluded by nature of being an `os.Exit` path.
