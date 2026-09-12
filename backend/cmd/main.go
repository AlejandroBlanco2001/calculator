package main

import (
	"encoding/json"
	"log"
	"net/http"

	backend "calculadora/backend"

	"github.com/go-chi/chi/v5"
)

func newRouter() *chi.Mux {
	r := chi.NewRouter()
	r.Post("/calculate", handleCalculate)
	return r
}

func handleCalculate(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Expression string `json:"expression"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Expression == "" {
		http.Error(w, "missing or invalid 'expression' field", http.StatusBadRequest)
		return
	}

	tokens, err := backend.InfixToRPN(body.Expression)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := backend.EvaluateRPN(tokens)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]float32{"result": result})
}

func main() {
	log.Println("listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", newRouter()))
}
