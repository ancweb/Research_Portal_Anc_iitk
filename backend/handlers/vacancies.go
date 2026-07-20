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

// GetVacancies handles GET /api/vacancies
// Returns all active vacancies sorted by deadline ascending.
func GetVacancies(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.DB.Query(`
		SELECT id, project_title, professor_name, department,
		       description, eligibility, stipend,
		       deadline, is_active, created_at, updated_at
		FROM project_vacancies
		WHERE is_active = TRUE
		ORDER BY deadline ASC NULLS LAST
	`)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var vacancies []models.Vacancy
	for rows.Next() {
		var v models.Vacancy
		var id int
		var deadline *time.Time
		var createdAt, updatedAt time.Time

		err := rows.Scan(
			&id, &v.ProjectTitle, &v.ProfessorName, &v.Department,
			&v.Description, &v.Eligibility, &v.Stipend,
			&deadline, &v.IsActive, &createdAt, &updatedAt,
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		v.ID = fmt.Sprintf("%d", id)
		v.Title = v.ProjectTitle // keep both field names populated
		v.CreatedAt = createdAt
		v.UpdatedAt = updatedAt

		if deadline != nil {
			ds := deadline.Format("2006-01-02")
			v.Deadline = &ds
		}

		vacancies = append(vacancies, v)
	}

	if vacancies == nil {
		vacancies = []models.Vacancy{}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(vacancies)
}

// CreateVacancy handles POST /api/vacancies (protected by Auth middleware)
func CreateVacancy(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input models.VacancyInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body."})
		return
	}

	input.ProjectTitle = strings.TrimSpace(input.ProjectTitle)
	input.ProfessorName = strings.TrimSpace(input.ProfessorName)
	input.Department = strings.TrimSpace(input.Department)
	input.Description = strings.TrimSpace(input.Description)
	input.Eligibility = strings.TrimSpace(input.Eligibility)
	input.Stipend = strings.TrimSpace(input.Stipend)

	if input.ProjectTitle == "" || input.ProfessorName == "" || input.Department == "" ||
		input.Description == "" || input.Eligibility == "" || input.Stipend == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Project title, professor name, department, description, eligibility, stipend, and deadline are required.",
		})
		return
	}

	// deadline is optional — parse if provided
	var deadline *string
	if d := strings.TrimSpace(input.Deadline); d != "" {
		// Validate the date is parseable
		if _, err := time.Parse("2006-01-02", d); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Deadline must be a valid date (YYYY-MM-DD)."})
			return
		}
		deadline = &d
	}

	var id int
	var createdAt, updatedAt time.Time
	err := db.DB.QueryRow(`
		INSERT INTO project_vacancies
			(project_title, professor_name, department, description, eligibility, stipend, deadline, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
		RETURNING id, created_at, updated_at
	`, input.ProjectTitle, input.ProfessorName, input.Department,
		input.Description, input.Eligibility, input.Stipend, deadline,
	).Scan(&id, &createdAt, &updatedAt)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	v := models.Vacancy{
		ID:            fmt.Sprintf("%d", id),
		ProjectTitle:  input.ProjectTitle,
		Title:         input.ProjectTitle,
		ProfessorName: input.ProfessorName,
		Department:    input.Department,
		Description:   input.Description,
		Eligibility:   input.Eligibility,
		Stipend:       input.Stipend,
		Deadline:      deadline,
		IsActive:      true,
		CreatedAt:     createdAt,
		UpdatedAt:     updatedAt,
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(v)
}
