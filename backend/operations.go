package backend

import (
	"errors"
	"math"
)

func Add(a, b float32) float32      { return a + b }
func Subtract(a, b float32) float32 { return a - b }
func Multiply(a, b float32) float32 { return a * b }

func Divide(a, b float32) (float32, error) {
	if b == 0 {
		return 0, errors.New("Division by Zero")
	}
	return a / b, nil
}

func Sqrt(a float32) (float32, error) {
	if a < 0 {
		return 0, errors.New("Negative square root")
	}
	return float32(math.Sqrt(float64(a))), nil
}

func Pow(a, b float32) float32 { return float32(math.Pow(float64(a), float64(b))) }

func Percent(a float32) float32 { return a / 100 }
