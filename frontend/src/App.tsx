import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { appendCloseParen, appendOpenParen, appendOperator } from './validators'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL ?? ''
const OPERATORS = new Set(['+', '-', '*', '/', '^', '%'])
const NAV_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'])
const ALLOWED_CHARS = new Set([...'0123456789.+-*/^%()√'])

export default function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  // Signals the cursor position to set after the next DOM update
  const pendingCursorRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (pendingCursorRef.current !== null && result === null) {
      inputRef.current?.setSelectionRange(pendingCursorRef.current, pendingCursorRef.current)
      pendingCursorRef.current = null
    }
  })

  function getCursor(): number {
    return inputRef.current?.selectionStart ?? expression.length
  }

  function commitChange(newExpr: string, newCursor: number) {
    pendingCursorRef.current = newCursor
    setExpression(newExpr)
  }

  function handleChar(char: string) {
    if (result !== null) {
      if (!isError && OPERATORS.has(char)) {
        // Carry result: use it as the base of the new expression
        const [newExpr, newCursor] = appendOperator(result, char, result.length)
        setResult(null)
        setIsError(false)
        commitChange(newExpr, newCursor)
      } else {
        // Start fresh; if it's a digit/decimal, seed with it
        setResult(null)
        setIsError(false)
        commitChange(OPERATORS.has(char) ? '' : char, OPERATORS.has(char) ? 0 : char.length)
      }
      return
    }

    const cur = getCursor()

    if (char === '(') {
      commitChange(...appendOpenParen(expression, cur))
    } else if (char === ')') {
      commitChange(...appendCloseParen(expression, cur))
    } else if (OPERATORS.has(char)) {
      commitChange(...appendOperator(expression, char, cur))
    } else {
      const left = expression.slice(0, cur)
      const right = expression.slice(cur)
      commitChange(left + char + right, cur + 1)
    }
  }

  function handleClear() {
    commitChange('', 0)
    setResult(null)
    setIsError(false)
  }

  function handleBackspace() {
    if (result !== null) { handleClear(); return }
    const cur = getCursor()
    if (cur === 0) return
    const left = expression.slice(0, cur)
    const right = expression.slice(cur)
    commitChange(left.slice(0, -1) + right, cur - 1)
  }

  async function handleCalculate() {
    if (!expression) return
    try {
      const res = await fetch(`${API_BASE}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression }),
      })
      if (res.ok) {
        const data = await res.json()
        setResult(String(data.result))
        setIsError(false)
      } else {
        setResult((await res.text()).trim())
        setIsError(true)
      }
    } catch {
      setResult('Error')
      setIsError(true)
    }
  }

  // Keep a ref to the latest handlers so the window listener never goes stale
  const handlersRef = useRef({ handleChar, handleBackspace, handleCalculate })
  handlersRef.current = { handleChar, handleBackspace, handleCalculate }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (NAV_KEYS.has(e.key)) return

      const { handleChar, handleBackspace, handleCalculate } = handlersRef.current

      if (e.key === 'Enter')     { e.preventDefault(); handleCalculate(); return }
      if (e.key === 'Backspace') { e.preventDefault(); handleBackspace(); return }
      if (ALLOWED_CHARS.has(e.key)) { e.preventDefault(); handleChar(e.key) }
      else if (e.key.length === 1)  { e.preventDefault() } // swallow unhandled printable chars
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function btn(fn: () => void) {
    return () => { fn(); inputRef.current?.focus() }
  }

  return (
    <div className="calculator">
      <div className="display-area">
        <input
          ref={inputRef}
          className={`display${isError ? ' display--error' : ''}`}
          data-testid="display"
          value={result !== null ? result : expression}
          readOnly={result !== null}
          onChange={() => {}}
          onKeyDown={e => {
            if (!e.metaKey && !e.ctrlKey && !e.altKey && !NAV_KEYS.has(e.key)) {
              e.preventDefault()
            }
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
        />
      </div>

      <div className="buttons">
        <button onClick={btn(handleClear)} className="btn btn-action">AC</button>
        <button onClick={btn(() => handleChar('('))} className="btn btn-action">(</button>
        <button onClick={btn(() => handleChar(')'))} className="btn btn-action">)</button>
        <button onClick={btn(() => handleChar('%'))} className="btn btn-operator">%</button>

        <button onClick={btn(() => handleChar('7'))} className="btn btn-number">7</button>
        <button onClick={btn(() => handleChar('8'))} className="btn btn-number">8</button>
        <button onClick={btn(() => handleChar('9'))} className="btn btn-number">9</button>
        <button onClick={btn(() => handleChar('/'))} className="btn btn-operator">÷</button>

        <button onClick={btn(() => handleChar('4'))} className="btn btn-number">4</button>
        <button onClick={btn(() => handleChar('5'))} className="btn btn-number">5</button>
        <button onClick={btn(() => handleChar('6'))} className="btn btn-number">6</button>
        <button onClick={btn(() => handleChar('*'))} className="btn btn-operator">×</button>

        <button onClick={btn(() => handleChar('1'))} className="btn btn-number">1</button>
        <button onClick={btn(() => handleChar('2'))} className="btn btn-number">2</button>
        <button onClick={btn(() => handleChar('3'))} className="btn btn-number">3</button>
        <button onClick={btn(() => handleChar('-'))} className="btn btn-operator">-</button>

        <button onClick={btn(() => handleChar('√'))} className="btn btn-action">√</button>
        <button onClick={btn(() => handleChar('0'))} className="btn btn-number">0</button>
        <button onClick={btn(() => handleChar('.'))} className="btn btn-number">.</button>
        <button onClick={btn(() => handleChar('+'))} className="btn btn-operator">+</button>

        <button onClick={btn(() => handleChar('^'))} className="btn btn-action">xʸ</button>
        <button onClick={btn(handleCalculate)} className="btn btn-equals span-3">=</button>
      </div>
    </div>
  )
}
