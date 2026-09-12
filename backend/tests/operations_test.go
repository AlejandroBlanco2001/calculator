package tests

import (
	"testing"

	backend "calculadora/backend"
)

func TestDivide(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float32
		want    float32
		wantErr bool
	}{
		{"normal division", 10, 2, 5, false},
		{"division by zero", 5, 0, 0, true},
		{"negative numerator", -9, 3, -3, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := backend.Divide(tt.a, tt.b)
			if (err != nil) != tt.wantErr {
				t.Fatalf("Divide(%v, %v) error = %v, wantErr %v", tt.a, tt.b, err, tt.wantErr)
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("Divide(%v, %v) = %v, want %v", tt.a, tt.b, got, tt.want)
			}
		})
	}
}

func TestSqrt(t *testing.T) {
	tests := []struct {
		name    string
		a       float32
		want    float32
		wantErr bool
	}{
		{"positive sqrt", 9, 3, false},
		{"zero sqrt", 0, 0, false},
		{"negative sqrt", -4, 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := backend.Sqrt(tt.a)
			if (err != nil) != tt.wantErr {
				t.Fatalf("Sqrt(%v) error = %v, wantErr %v", tt.a, err, tt.wantErr)
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("Sqrt(%v) = %v, want %v", tt.a, got, tt.want)
			}
		})
	}
}
