const OPERATORS = new Set(['+', '-', '*', '/', '^', '%'])

export function appendOpenParen(expr: string): string {
  return expr + '()'
}

export function appendCloseParen(expr: string): string {
  const unmatched = [...expr].reduce((count, ch) => {
    if (ch === '(') return count + 1
    if (ch === ')') return count - 1
    return count
  }, 0)

  return unmatched > 0 ? expr + ')' : expr
}

export function appendOperator(expr: string, op: string): string {
  const lastChar = expr[expr.length - 1]

  if (OPERATORS.has(lastChar)) {
    if (op === '-' && lastChar !== '-') {
      return expr + op
    }
    return expr.slice(0, -1) + op
  }

  return expr + op
}
