package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"research-portal/backend/db"
	"research-portal/backend/handlers"
	"research-portal/backend/middleware"
)

func main() {
	// Load .env file if present (ignored in production where vars are injected)
	_ = godotenv.Load()

	// Connect to PostgreSQL and run migrations
	db.Connect()
	db.Migrate()

	r := mux.NewRouter()

	// ── Health check ────────────────────────────────────────────────────────
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "ok",
			"timestamp": time.Now(),
		})
	}).Methods(http.MethodGet)

	// ── Auth routes ─────────────────────────────────────────────────────────
	r.HandleFunc("/api/auth/login", handlers.Login).Methods(http.MethodPost)
	r.Handle("/api/auth/me", middleware.Auth(http.HandlerFunc(handlers.Me))).Methods(http.MethodGet)

	// ── Professor routes ────────────────────────────────────────────────────
	r.HandleFunc("/api/professors", handlers.GetProfessors).Methods(http.MethodGet)
	r.Handle("/api/professors", middleware.Auth(http.HandlerFunc(handlers.CreateProfessor))).Methods(http.MethodPost)

	// ── Vacancy routes ──────────────────────────────────────────────────────
	r.HandleFunc("/api/vacancies", handlers.GetVacancies).Methods(http.MethodGet)
	r.Handle("/api/vacancies", middleware.Auth(http.HandlerFunc(handlers.CreateVacancy))).Methods(http.MethodPost)

	// ── Internship routes ───────────────────────────────────────────────────
	r.HandleFunc("/api/internships", handlers.GetInternships).Methods(http.MethodGet)
	r.Handle("/api/internships", middleware.Auth(http.HandlerFunc(handlers.CreateInternship))).Methods(http.MethodPost)

	// ── Event routes ────────────────────────────────────────────────────────
	r.HandleFunc("/api/events", handlers.GetEvents).Methods(http.MethodGet)
	r.Handle("/api/events", middleware.Auth(http.HandlerFunc(handlers.CreateEvent))).Methods(http.MethodPost)

	// ── CORS ─────────────────────────────────────────────────────────────────
	// Allow all origins in development. Tighten in production by setting
	// CORS_ALLOWED_ORIGINS env variable.
	allowedOrigins := []string{"*"}
	if origins := os.Getenv("CORS_ALLOWED_ORIGINS"); origins != "" {
		allowedOrigins = []string{origins}
	}

	c := cors.New(cors.Options{
		AllowedOrigins: allowedOrigins,
		AllowedMethods: []string{
			http.MethodGet, http.MethodPost, http.MethodPut,
			http.MethodPatch, http.MethodDelete, http.MethodOptions,
		},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      c.Handler(r),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("Backend server running on port %s", port)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
