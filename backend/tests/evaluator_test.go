package tests

import (
	"testing"

	backend "calculadora/backend"
)

func TestInfixToRPN(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  []string
	}{
		{"simple addition", "2+3", []string{"2", "3", "+"}},
		{"precedence multiply over add", "2+3*4", []string{"2", "3", "4", "*", "+"}},
		{"parentheses override precedence", "(2+3)*4", []string{"2", "3", "+", "4", "*"}},
		{"exponent", "2^3", []string{"2", "3", "^"}},
		{"sqrt unary", "√9", []string{"9", "√"}},
		{"percent unary", "50%", []string{"50", "%"}},
		{"multi-digit numbers", "12+34", []string{"12", "34", "+"}},
		{"decimal numbers", "1.5*2", []string{"1.5", "2", "*"}},
		{"simple mixed operations", "2+3*4", []string{"2", "3", "4", "*", "+"}},
		{"complex nested parentheses", "(2+3)*(8-2^2)", []string{"2", "3", "+", "8", "2", "2", "^", "-", "*"}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := backend.InfixToRPN(tt.input)
			if err != nil {
				t.Fatalf("InfixToRPN(%q) unexpected error: %v", tt.input, err)
			}
			if len(got) != len(tt.want) {
				t.Fatalf("InfixToRPN(%q) = %v, want %v", tt.input, got, tt.want)
			}
			for i := range got {
				if got[i] != tt.want[i] {
					t.Errorf("InfixToRPN(%q)[%d] = %q, want %q", tt.input, i, got[i], tt.want[i])
				}
			}
		})
	}
}

func TestEvaluateRPN(t *testing.T) {
	tests := []struct {
		name    string
		tokens  []string
		want    float32
		wantErr bool
	}{
		{"addition", []string{"2", "3", "+"}, 5, false},
		{"subtraction", []string{"10", "4", "-"}, 6, false},
		{"multiplication", []string{"3", "4", "*"}, 12, false},
		{"division", []string{"10", "2", "/"}, 5, false},
		{"division by zero", []string{"5", "0", "/"}, 0, true},
		{"exponent", []string{"2", "3", "^"}, 8, false},
		{"sqrt", []string{"9", "√"}, 3, false},
		{"negative sqrt", []string{"4", "-1", "*", "√"}, 0, true},
		{"percent", []string{"50", "%"}, 0.5, false},
		{"invalid token", []string{"a", "2", "+"}, 0, true},
		{"not enough operands", []string{"2", "+"}, 0, true},
		{"simple mixed operations", []string{"2", "3", "4", "*", "+"}, 14, false},
		{"complex nested parentheses", []string{"2", "3", "+", "8", "2", "2", "^", "-", "*"}, 20, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := backend.EvaluateRPN(tt.tokens)
			if (err != nil) != tt.wantErr {
				t.Fatalf("EvaluateRPN(%v) error = %v, wantErr %v", tt.tokens, err, tt.wantErr)
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("EvaluateRPN(%v) = %v, want %v", tt.tokens, got, tt.want)
			}
		})
	}
}
