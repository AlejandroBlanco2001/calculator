import { describe, expect, it } from 'vitest'
import { appendCloseParen, appendOpenParen, appendOperator } from './validators'

describe('appendOpenParen', () => {
  it('always appends a closing parenthesis', () => {
    expect(appendOpenParen('2+3')).toBe('2+3()')
  })

  it('works on empty expression', () => {
    expect(appendOpenParen('')).toBe('()')
  })

  it('supports nested parentheses', () => {
    expect(appendOpenParen('2+(')).toBe('2+(()')
  })
})

describe('appendCloseParen', () => {
  it('appends close paren when there is an unmatched open paren', () => {
    expect(appendCloseParen('(2+3')).toBe('(2+3)')
  })

  it('rejects close paren when there is no open paren', () => {
    expect(appendCloseParen('2+3')).toBe('2+3')
  })

  it('rejects close paren on empty expression', () => {
    expect(appendCloseParen('')).toBe('')
  })

  it('rejects close paren when all parens are already balanced', () => {
    expect(appendCloseParen('(2+3)')).toBe('(2+3)')
  })
})

describe('appendOperator', () => {
  it('appends operator to a normal expression', () => {
    expect(appendOperator('2', '+')).toBe('2+')
  })

  it('deduplicates consecutive same operators', () => {
    expect(appendOperator('2*', '*')).toBe('2*')
  })

  it('replaces the last operator when switching', () => {
    expect(appendOperator('2*', '/')).toBe('2/')
  })

  it('allows minus after a non-minus operator', () => {
    expect(appendOperator('2*', '-')).toBe('2*-')
  })

  it('deduplicates consecutive minus signs', () => {
    expect(appendOperator('2*-', '-')).toBe('2*-')
  })

  it('replaces a negation minus when switching to another operator', () => {
    expect(appendOperator('2*-', '+')).toBe('2*+')
  })
})
