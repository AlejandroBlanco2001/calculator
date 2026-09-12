import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

function display() {
  return screen.getByTestId('display').textContent
}

describe('open parenthesis', () => {
  it('clicking ( always adds a closing paren', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('('))
    expect(display()).toBe('()')
  })

  it('typing ( always adds a closing paren', async () => {
    render(<App />)
    await userEvent.keyboard('(')
    expect(display()).toBe('()')
  })
})

describe('close parenthesis', () => {
  it('clicking ) with no open paren is rejected', async () => {
    render(<App />)
    await userEvent.click(screen.getByText(')'))
    expect(display()).toBe('')
  })

  it('typing ) with no open paren is rejected', async () => {
    render(<App />)
    await userEvent.keyboard(')')
    expect(display()).toBe('')
  })
})

describe('operator deduplication', () => {
  it('pressing the same operator multiple times keeps only one', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('2'))
    await userEvent.click(screen.getByText('×'))
    await userEvent.click(screen.getByText('×'))
    await userEvent.click(screen.getByText('×'))
    expect(display()).toBe('2*')
  })

  it('typing the same operator multiple times keeps only one', async () => {
    render(<App />)
    await userEvent.keyboard('2***')
    expect(display()).toBe('2*')
  })

  it('switching operators replaces with the last one pressed', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('2'))
    await userEvent.click(screen.getByText('×'))
    await userEvent.click(screen.getByText('÷'))
    expect(display()).toBe('2/')
  })

  it('typing to switch operators replaces with the last one', async () => {
    render(<App />)
    await userEvent.keyboard('2*/')
    expect(display()).toBe('2/')
  })

  it('allows minus after another operator', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('2'))
    await userEvent.click(screen.getByText('×'))
    await userEvent.click(screen.getByText('-'))
    expect(display()).toBe('2*-')
  })
})

describe('AC button', () => {
  it('clears the expression', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('2'))
    await userEvent.click(screen.getByText('+'))
    await userEvent.click(screen.getByText('3'))
    await userEvent.click(screen.getByText('AC'))
    expect(display()).toBe('')
  })
})

describe('keyboard input', () => {
  it('ignores letters and non-allowed characters', async () => {
    render(<App />)
    await userEvent.keyboard('abc2def')
    expect(display()).toBe('2')
  })
})
