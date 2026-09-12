import { describe, expect, it } from 'vitest'
import { appendCloseParen, appendOpenParen, appendOperator } from './validators'

describe('appendOpenParen', () => {
  it('inserts () at end and places cursor between them', () => {
    expect(appendOpenParen('2+3', 3)).toEqual(['2+3()', 4])
  })

  it('works on empty expression', () => {
    expect(appendOpenParen('', 0)).toEqual(['()', 1])
  })

  it('inserts () at cursor position in the middle of expression', () => {
    expect(appendOpenParen('23', 1)).toEqual(['2()3', 2])
  })

  it('supports nested parentheses', () => {
    expect(appendOpenParen('2+(', 3)).toEqual(['2+(()' , 4])
  })
})

describe('appendCloseParen', () => {
  it('inserts ) at cursor when there is an unmatched open paren', () => {
    expect(appendCloseParen('(2+3', 4)).toEqual(['(2+3)', 5])
  })

  it('inserts ) at cursor position in the middle', () => {
    expect(appendCloseParen('(2+3', 2)).toEqual(['(2)+3', 3])
  })

  it('rejects when there is no open paren', () => {
    expect(appendCloseParen('2+3', 3)).toEqual(['2+3', 3])
  })

  it('rejects on empty expression', () => {
    expect(appendCloseParen('', 0)).toEqual(['', 0])
  })

  it('rejects when all parens are already balanced', () => {
    expect(appendCloseParen('(2+3)', 5)).toEqual(['(2+3)', 5])
  })
})

describe('appendOperator', () => {
  it('appends operator at cursor', () => {
    expect(appendOperator('2', '+', 1)).toEqual(['2+', 2])
  })

  it('inserts operator in the middle of expression', () => {
    expect(appendOperator('23', '+', 1)).toEqual(['2+3', 2])
  })

  it('deduplicates consecutive same operators', () => {
    expect(appendOperator('2*', '*', 2)).toEqual(['2*', 2])
  })

  it('replaces the last operator when switching', () => {
    expect(appendOperator('2*', '/', 2)).toEqual(['2/', 2])
  })

  it('allows minus after a non-minus operator', () => {
    expect(appendOperator('2*', '-', 2)).toEqual(['2*-', 3])
  })

  it('deduplicates consecutive minus signs', () => {
    expect(appendOperator('2*-', '-', 3)).toEqual(['2*-', 3])
  })

  it('replaces a negation minus when switching to another operator', () => {
    expect(appendOperator('2*-', '+', 3)).toEqual(['2*+', 3])
  })
})
