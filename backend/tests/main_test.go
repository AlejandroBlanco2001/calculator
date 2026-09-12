package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	backend "calculadora/backend"
)

func TestCalculateEndpoint(t *testing.T) {
	router := backend.NewRouter()

	tests := []struct {
		name       string
		body       any
		wantStatus int
	}{
		{
			name:       "valid expression returns 200 with result",
			body:       map[string]string{"expression": "2+3"},
			wantStatus: http.StatusOK,
		},
		{
			name:       "missing expression field returns 400",
			body:       map[string]string{"wrong_field": "2+3"},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "invalid infix expression returns 400",
			body:       map[string]string{"expression": "++invalid++"},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "division by zero returns 400",
			body:       map[string]string{"expression": "5/0"},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "negative square root returns 400",
			body:       map[string]string{"expression": "√-9"},
			wantStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			payload, _ := json.Marshal(tt.body)
			req := httptest.NewRequest(http.MethodPost, "/calculate", bytes.NewReader(payload))
			req.Header.Set("Content-Type", "application/json")
			rec := httptest.NewRecorder()

			router.ServeHTTP(rec, req)

			if rec.Code != tt.wantStatus {
				t.Errorf("status = %d, want %d — body: %s", rec.Code, tt.wantStatus, rec.Body.String())
			}
		})
	}
}

func TestCalculateEndpointResultField(t *testing.T) {
	router := backend.NewRouter()

	payload := []byte(`{"expression":"2+3"}`)
	req := httptest.NewRequest(http.MethodPost, "/calculate", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}

	var resp map[string]any
	if err := json.NewDecoder(rec.Body).Decode(&resp); err != nil {
		t.Fatalf("could not decode response: %v", err)
	}
	if _, ok := resp["result"]; !ok {
		t.Errorf("response missing 'result' field: %v", resp)
	}
}
