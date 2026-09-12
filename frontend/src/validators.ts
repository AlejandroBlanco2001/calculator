const OPERATORS = new Set(['+', '-', '*', '/', '^', '%'])

export function appendOpenParen(expr: string, cursor: number): [string, number] {
  const left = expr.slice(0, cursor)
  const right = expr.slice(cursor)
  return [left + '()' + right, cursor + 1]
}

export function appendCloseParen(expr: string, cursor: number): [string, number] {
  const unmatched = [...expr].reduce((count, ch) => {
    if (ch === '(') return count + 1
    if (ch === ')') return count - 1
    return count
  }, 0)

  if (unmatched <= 0) return [expr, cursor]

  const left = expr.slice(0, cursor)
  const right = expr.slice(cursor)
  return [left + ')' + right, cursor + 1]
}

export function appendOperator(expr: string, op: string, cursor: number): [string, number] {
  const left = expr.slice(0, cursor)
  const right = expr.slice(cursor)
  const lastChar = left[left.length - 1]

  if (OPERATORS.has(lastChar)) {
    if (op === '-' && lastChar !== '-') {
      return [left + op + right, cursor + 1]
    }
    return [left.slice(0, -1) + op + right, cursor]
  }

  return [left + op + right, cursor + 1]
}
