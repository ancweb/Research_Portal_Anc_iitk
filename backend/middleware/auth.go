// Package middleware provides HTTP middleware for the research-portal backend.
package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// contextKey is a private type to avoid collisions in context values.
type contextKey string

const UserContextKey contextKey = "user"

// UserClaims holds the authenticated user's data extracted from the JWT.
type UserClaims struct {
	ID    float64 `json:"id"`
	Email string  `json:"email"`
	Role  string  `json:"role"`
}

// Auth validates the Bearer token in the Authorization header.
// On success it stores the decoded claims in the request context under UserContextKey.
// On failure it responds with 401 and halts the chain.
func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, `{"error":"Access denied. No token provided."}`, http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			http.Error(w, `{"error":"Server authentication misconfiguration."}`, http.StatusInternalServerError)
			return
		}

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, `{"error":"Invalid or expired token."}`, http.StatusUnauthorized)
			return
		}

		mapClaims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, `{"error":"Invalid token claims."}`, http.StatusUnauthorized)
			return
		}

		claims := UserClaims{
			Email: mapClaims["email"].(string),
			Role:  mapClaims["role"].(string),
		}
		// id may be stored as float64 by the JWT library
		if id, ok := mapClaims["id"]; ok {
			claims.ID, _ = id.(float64)
		}

		ctx := context.WithValue(r.Context(), UserContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUser retrieves the authenticated user claims from the request context.
func GetUser(r *http.Request) (UserClaims, bool) {
	claims, ok := r.Context().Value(UserContextKey).(UserClaims)
	return claims, ok
}
