package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"research-portal/backend/db"
	"research-portal/backend/models"
)

// GetInternships handles GET /api/internships
// Returns all internships sorted by deadline then created_at desc.
func GetInternships(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.DB.Query(`
		SELECT id, university_name, internship_program_name, country,
		       application_link, eligibility, deadline, created_at, updated_at
		FROM international_internships
		ORDER BY deadline ASC NULLS LAST, created_at DESC
	`)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var internships []models.Internship
	for rows.Next() {
		var i models.Internship
		var id int
		var eligibility *string
		var deadline *time.Time
		var createdAt, updatedAt time.Time

		err := rows.Scan(
			&id, &i.UniversityName, &i.InternshipProgramName, &i.Country,
			&i.ApplicationLink, &eligibility, &deadline, &createdAt, &updatedAt,
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		i.ID = fmt.Sprintf("%d", id)
		i.CreatedAt = createdAt
		i.UpdatedAt = updatedAt

		if eligibility != nil {
			i.Eligibility = *eligibility
		}
		if deadline != nil {
			ds := deadline.Format("2006-01-02")
			i.Deadline = &ds
		}

		internships = append(internships, i)
	}

	if internships == nil {
		internships = []models.Internship{}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(internships)
}

// CreateInternship handles POST /api/internships (protected by Auth middleware)
func CreateInternship(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input models.InternshipInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body."})
		return
	}

	input.UniversityName = strings.TrimSpace(input.UniversityName)
	input.InternshipProgramName = strings.TrimSpace(input.InternshipProgramName)
	input.Country = strings.TrimSpace(input.Country)
	input.ApplicationLink = strings.TrimSpace(input.ApplicationLink)
	input.Eligibility = strings.TrimSpace(input.Eligibility)

	if input.UniversityName == "" || input.InternshipProgramName == "" ||
		input.Country == "" || input.ApplicationLink == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "University name, program name, country, and application link are required.",
		})
		return
	}

	var deadline *string
	if d := strings.TrimSpace(input.Deadline); d != "" {
		if _, err := time.Parse("2006-01-02", d); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Deadline must be a valid date (YYYY-MM-DD)."})
			return
		}
		deadline = &d
	}

	var eligibility *string
	if input.Eligibility != "" {
		eligibility = &input.Eligibility
	}

	var id int
	var createdAt, updatedAt time.Time
	err := db.DB.QueryRow(`
		INSERT INTO international_internships
			(university_name, internship_program_name, country, application_link, eligibility, deadline)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`, input.UniversityName, input.InternshipProgramName, input.Country,
		input.ApplicationLink, eligibility, deadline,
	).Scan(&id, &createdAt, &updatedAt)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	result := models.Internship{
		ID:                    fmt.Sprintf("%d", id),
		UniversityName:        input.UniversityName,
		InternshipProgramName: input.InternshipProgramName,
		Country:               input.Country,
		ApplicationLink:       input.ApplicationLink,
		Eligibility:           input.Eligibility,
		Deadline:              deadline,
		CreatedAt:             createdAt,
		UpdatedAt:             updatedAt,
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(result)
}
