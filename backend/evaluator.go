package backend

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"unicode"
)
 
// For more operations, you can add them to the precedence map below, followed by their precedence level.
// Higher numbers indicate higher precedence.
var precedence = map[string]int{
	"+": 1, "-": 1,
	"*": 2, "/": 2, "%": 2,
	"^": 3,
	"√": 4,
}

func isOperator(tok string) bool {
	_, ok := precedence[tok]
	return ok
}

func isUnary(tok string) bool {
	return tok == "√" || tok == "%"
}

func isRightAssociative(tok string) bool {
	return tok == "^"
}

// InfixToRPN converts an infix expression string to a slice of RPN tokens
// using the Shunting Yard algorithm.
func InfixToRPN(expr string) ([]string, error) {
	var output []string
	var opStack []string

	i := 0
	runes := []rune(expr)

	for i < len(runes) {
		ch := runes[i]

		if unicode.IsSpace(ch) {
			i++
			continue
		}

		// Number (including decimals)
		if unicode.IsDigit(ch) || ch == '.' {
			j := i
			for j < len(runes) && (unicode.IsDigit(runes[j]) || runes[j] == '.') {
				j++
			}
			output = append(output, string(runes[i:j]))
			i = j
			continue
		}

		// Operators and parentheses
		tok := string(ch)

		if tok == "(" {
			opStack = append(opStack, tok)
			i++
			continue
		}

		if tok == ")" {
			for len(opStack) > 0 && opStack[len(opStack)-1] != "(" {
				output = append(output, opStack[len(opStack)-1])
				opStack = opStack[:len(opStack)-1]
			}
			if len(opStack) == 0 {
				return nil, errors.New("mismatched parentheses")
			}
			opStack = opStack[:len(opStack)-1] // pop "("
			i++
			continue
		}

		if isOperator(tok) {
			for len(opStack) > 0 {
				top := opStack[len(opStack)-1]
				if top == "(" {
					break
				}
				if !isOperator(top) {
					break
				}
				topPrec := precedence[top]
				tokPrec := precedence[tok]
				if topPrec > tokPrec || (topPrec == tokPrec && !isRightAssociative(tok)) {
					output = append(output, top)
					opStack = opStack[:len(opStack)-1]
				} else {
					break
				}
			}
			opStack = append(opStack, tok)
			i++
			continue
		}

		return nil, fmt.Errorf("unknown character: %q", tok)
	}

	for len(opStack) > 0 {
		top := opStack[len(opStack)-1]
		if top == "(" || top == ")" {
			return nil, errors.New("mismatched parentheses")
		}
		output = append(output, top)
		opStack = opStack[:len(opStack)-1]
	}

	return output, nil
}

// EvaluateRPN evaluates a slice of RPN tokens and returns the result.
func EvaluateRPN(tokens []string) (float32, error) {
	var stack []float32

	pop := func() (float32, error) {
		if len(stack) == 0 {
			return 0, errors.New("invalid expression")
		}
		val := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		return val, nil
	}

	for _, tok := range tokens {
		if isOperator(tok) {
			if isUnary(tok) {
				a, err := pop()
				if err != nil {
					return 0, err
				}
				switch tok {
				case "√":
					result, err := Sqrt(a)
					if err != nil {
						return 0, err
					}
					stack = append(stack, result)
				case "%":
					stack = append(stack, Percent(a))
				}
			} else {
				b, err := pop()
				if err != nil {
					return 0, err
				}
				a, err := pop()
				if err != nil {
					return 0, err
				}
				switch tok {
				case "+":
					stack = append(stack, Add(a, b))
				case "-":
					stack = append(stack, Subtract(a, b))
				case "*":
					stack = append(stack, Multiply(a, b))
				case "/":
					result, err := Divide(a, b)
					if err != nil {
						return 0, err
					}
					stack = append(stack, result)
				case "^":
					stack = append(stack, Pow(a, b))
				}
			}
		} else {
			tok = strings.TrimSpace(tok)
			val, err := strconv.ParseFloat(tok, 32)
			if err != nil {
				return 0, fmt.Errorf("invalid token: %q", tok)
			}
			stack = append(stack, float32(val))
		}
	}

	if len(stack) != 1 {
		return 0, errors.New("invalid expression")
	}
	return stack[0], nil
}
