import { useEffect, useRef, useState } from 'react'
import { appendCloseParen, appendOpenParen, appendOperator } from './validators'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL ?? ''
const OPERATORS = new Set(['+', '-', '*', '/', '^', '%'])
const ALLOWED_KEYS = new Set([...Array.from('0123456789.+-*/^%()'), 'Enter', 'Backspace'])

export default function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const expressionRef = useRef(expression)
  expressionRef.current = expression

  function handleChar(char: string) {
    setResult(null)
    if (char === '(') {
      setExpression(prev => appendOpenParen(prev))
    } else if (char === ')') {
      setExpression(prev => appendCloseParen(prev))
    } else if (OPERATORS.has(char)) {
      setExpression(prev => appendOperator(prev, char))
    } else {
      setExpression(prev => prev + char)
    }
  }

  function handleClear() {
    setExpression('')
    setResult(null)
  }

  async function handleCalculate() {
    const expr = expressionRef.current
    if (!expr) return
    try {
      const res = await fetch(`${API_BASE}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr }),
      })
      const data = res.ok ? await res.json() : null
      setResult(res.ok ? String(data.result) : await res.text())
    } catch {
      setResult('Error')
    }
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!ALLOWED_KEYS.has(e.key)) return
      if (e.key === 'Enter') { handleCalculate(); return }
      if (e.key === 'Backspace') { setExpression(prev => prev.slice(0, -1)); return }
      handleChar(e.key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const shown = result ?? expression

  return (
    <div className="calculator">
      <div className="display" data-testid="display">{shown}</div>

      <div className="buttons">
        <button onClick={handleClear} className="btn btn-action">AC</button>
        <button onClick={() => handleChar('(')} className="btn btn-action">(</button>
        <button onClick={() => handleChar(')')} className="btn btn-action">)</button>
        <button onClick={() => handleChar('%')} className="btn btn-operator">%</button>

        <button onClick={() => handleChar('7')} className="btn btn-number">7</button>
        <button onClick={() => handleChar('8')} className="btn btn-number">8</button>
        <button onClick={() => handleChar('9')} className="btn btn-number">9</button>
        <button onClick={() => handleChar('/')} className="btn btn-operator">÷</button>

        <button onClick={() => handleChar('4')} className="btn btn-number">4</button>
        <button onClick={() => handleChar('5')} className="btn btn-number">5</button>
        <button onClick={() => handleChar('6')} className="btn btn-number">6</button>
        <button onClick={() => handleChar('*')} className="btn btn-operator">×</button>

        <button onClick={() => handleChar('1')} className="btn btn-number">1</button>
        <button onClick={() => handleChar('2')} className="btn btn-number">2</button>
        <button onClick={() => handleChar('3')} className="btn btn-number">3</button>
        <button onClick={() => handleChar('-')} className="btn btn-operator">-</button>

        <button onClick={() => handleChar('√')} className="btn btn-action">√</button>
        <button onClick={() => handleChar('0')} className="btn btn-number">0</button>
        <button onClick={() => handleChar('.')} className="btn btn-number">.</button>
        <button onClick={() => handleChar('+')} className="btn btn-operator">+</button>

        <button onClick={() => handleChar('^')} className="btn btn-action">xʸ</button>
        <button onClick={handleCalculate} className="btn btn-equals span-3">=</button>
      </div>
    </div>
  )
}
