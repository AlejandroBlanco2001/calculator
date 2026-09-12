import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, afterEach } from 'vitest'
import App from './App'

function displayValue() {
  return (screen.getByTestId('display') as HTMLInputElement).value
}

afterEach(() => vi.unstubAllGlobals())

describe('open parenthesis', () => {
  it('clicking ( always adds a closing paren', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('('))
    expect(displayValue()).toBe('()')
  })

  it('typing ( always adds a closing paren', async () => {
    render(<App />)
    await userEvent.keyboard('(')
    expect(displayValue()).toBe('()')
  })
})

describe('close parenthesis', () => {
  it('clicking ) with no open paren is rejected', async () => {
    render(<App />)
    await userEvent.click(screen.getByText(')'))
    expect(displayValue()).toBe('')
  })

  it('typing ) with no open paren is rejected', async () => {
    render(<App />)
    await userEvent.keyboard(')')
    expect(displayValue()).toBe('')
  })
})

describe('operator deduplication', () => {
  it('pressing the same operator multiple times keeps only one', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('2'))
    await userEvent.click(screen.getByText('×'))
    await userEvent.click(screen.getByText('×'))
    await userEvent.click(screen.getByText('×'))
    expect(displayValue()).toBe('2*')
  })

  it('typing the same operator multiple times keeps only one', async () => {
    render(<App />)
    await userEvent.keyboard('2***')
    expect(displayValue()).toBe('2*')
  })

  it('switching operators replaces with the last one pressed', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('2'))
    await userEvent.click(screen.getByText('×'))
    await userEvent.click(screen.getByText('÷'))
    expect(displayValue()).toBe('2/')
  })

  it('typing to switch operators replaces with the last one', async () => {
    render(<App />)
    await userEvent.keyboard('2*/')
    expect(displayValue()).toBe('2/')
  })

  it('allows minus after another operator', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('2'))
    await userEvent.click(screen.getByText('×'))
    await userEvent.click(screen.getByText('-'))
    expect(displayValue()).toBe('2*-')
  })
})

describe('AC button', () => {
  it('clears the expression', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('2'))
    await userEvent.click(screen.getByText('+'))
    await userEvent.click(screen.getByText('3'))
    await userEvent.click(screen.getByText('AC'))
    expect(displayValue()).toBe('')
  })
})

describe('keyboard input', () => {
  it('ignores letters and non-allowed characters', async () => {
    render(<App />)
    await userEvent.keyboard('abc2def')
    expect(displayValue()).toBe('2')
  })
})

describe('carry result', () => {
  it('pressing an operator after a result carries the result into the expression', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 4 }),
    }))

    render(<App />)
    await userEvent.keyboard('2+2')
    await userEvent.keyboard('{Enter}')
    expect(await screen.findByDisplayValue('4')).toBeTruthy()

    await userEvent.keyboard('+')
    expect(displayValue()).toBe('4+')
  })

  it('pressing a number after a result starts a fresh expression', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 4 }),
    }))

    render(<App />)
    await userEvent.keyboard('2+2{Enter}')
    await screen.findByDisplayValue('4')

    await userEvent.keyboard('7')
    expect(displayValue()).toBe('7')
  })
})

describe('error display', () => {
  it('shows error text in the display with error class', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Division by Zero'),
    }))

    render(<App />)
    await userEvent.keyboard('5/0{Enter}')

    const display = await screen.findByTestId('display')
    expect((display as HTMLInputElement).value).toBe('Division by Zero')
    expect(display.classList.contains('display--error')).toBe(true)
  })

  it('clears the error on next input', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Division by Zero'),
    }))

    render(<App />)
    await userEvent.keyboard('5/0{Enter}')
    await screen.findByTestId('display')

    await userEvent.keyboard('2')
    expect(displayValue()).toBe('2')
    expect(screen.getByTestId('display').classList.contains('display--error')).toBe(false)
  })
})
