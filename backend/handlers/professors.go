package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/lib/pq"

	"research-portal/backend/db"
	"research-portal/backend/models"
)

// GetProfessors handles GET /api/professors
// Returns all professors sorted by name ascending.
func GetProfessors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.DB.Query(`
		SELECT id, name, email, department, designation,
		       research_interests, lab_website, profile_image_url,
		       google_scholar_url, is_accepting_students, created_at, updated_at
		FROM professors
		ORDER BY name ASC
	`)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var professors []models.Professor
	for rows.Next() {
		var p models.Professor
		var id int
		var interests pq.StringArray
		var designation, profileImageURL, googleScholarURL, labWebsite *string
		var createdAt, updatedAt time.Time

		err := rows.Scan(
			&id, &p.Name, &p.Email, &p.Department, &designation,
			&interests, &labWebsite, &profileImageURL,
			&googleScholarURL, &p.IsAcceptingStudents, &createdAt, &updatedAt,
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		p.ID = fmt.Sprintf("%d", id)
		p.DepartmentID = p.Department
		p.Designation = designation
		p.ProfileImageURL = profileImageURL
		p.GoogleScholarURL = googleScholarURL
		p.CreatedAt = createdAt
		p.UpdatedAt = updatedAt

		if labWebsite != nil {
			p.LabWebsite = *labWebsite
		}

		// Populate both researchInterests and research_interests so the frontend
		// can read from either field (it checks both).
		interestSlice := []string(interests)
		if interestSlice == nil {
			interestSlice = []string{}
		}
		p.ResearchInterests = interestSlice
		p.ResearchInterests2 = interestSlice

		professors = append(professors, p)
	}

	if professors == nil {
		professors = []models.Professor{}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(professors)
}

// CreateProfessor handles POST /api/professors (protected by Auth middleware)
func CreateProfessor(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input models.ProfessorInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body."})
		return
	}

	input.Name = strings.TrimSpace(input.Name)
	input.Email = strings.TrimSpace(input.Email)
	input.Department = strings.TrimSpace(input.Department)

	if input.Name == "" || input.Email == "" || input.Department == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Name, email, and department are required."})
		return
	}

	// Sanitise research interests
	var interests []string
	for _, i := range input.ResearchInterests {
		if t := strings.TrimSpace(i); t != "" {
			interests = append(interests, t)
		}
	}
	if interests == nil {
		interests = []string{}
	}

	var id int
	var createdAt, updatedAt time.Time
	var designation *string
	if strings.TrimSpace(input.Designation) != "" {
		d := strings.TrimSpace(input.Designation)
		designation = &d
	}

	labWebsite := strings.TrimSpace(input.LabWebsite)

	err := db.DB.QueryRow(`
		INSERT INTO professors
			(name, email, department, designation, research_interests, lab_website, is_accepting_students)
		VALUES ($1, $2, $3, $4, $5, $6, FALSE)
		RETURNING id, created_at, updated_at
	`, input.Name, input.Email, input.Department, designation,
		pq.Array(interests), labWebsite,
	).Scan(&id, &createdAt, &updatedAt)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	prof := models.Professor{
		ID:                  fmt.Sprintf("%d", id),
		Name:                input.Name,
		Email:               input.Email,
		Department:          input.Department,
		DepartmentID:        input.Department,
		Designation:         designation,
		ResearchInterests:   interests,
		ResearchInterests2:  interests,
		LabWebsite:          labWebsite,
		IsAcceptingStudents: false,
		CreatedAt:           createdAt,
		UpdatedAt:           updatedAt,
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(prof)
}
