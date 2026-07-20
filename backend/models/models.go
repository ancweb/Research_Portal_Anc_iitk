// Package models defines the data structures shared across handlers.
// JSON field names intentionally match the MongoDB document format the
// frontend already expects (e.g. "_id" for identifiers, camelCase names).
package models

import "time"

// ─────────────────────────────────────────────
// User
// ─────────────────────────────────────────────

// User represents an admin account stored in the users table.
type User struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"-"` // never serialised to JSON
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// UserPublic is returned to the frontend (no password).
type UserPublic struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

// ─────────────────────────────────────────────
// Professor
// ─────────────────────────────────────────────

// Professor mirrors the MongoDB professors collection.
// _id is a string representation of the integer PK so the frontend
// can use the same `_id` field it used with MongoDB ObjectIDs.
type Professor struct {
	ID                  string    `json:"_id"`
	Name                string    `json:"name"`
	Email               string    `json:"email"`
	Department          string    `json:"department"`
	DepartmentID        string    `json:"department_id"`
	Designation         *string   `json:"designation"`
	ResearchInterests   []string  `json:"researchInterests"`
	ResearchInterests2  []string  `json:"research_interests"`
	LabWebsite          string    `json:"labWebsite"`
	ProfileImageURL     *string   `json:"profile_image_url"`
	GoogleScholarURL    *string   `json:"google_scholar_url"`
	IsAcceptingStudents bool      `json:"is_accepting_students"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

// ProfessorInput is what the POST body must contain.
type ProfessorInput struct {
	Name              string   `json:"name"`
	Email             string   `json:"email"`
	Department        string   `json:"department"`
	Designation       string   `json:"designation"`
	ResearchInterests []string `json:"researchInterests"`
	LabWebsite        string   `json:"labWebsite"`
}

// ─────────────────────────────────────────────
// Project Vacancy
// ─────────────────────────────────────────────

// Vacancy mirrors the MongoDB project_vacancies collection.
type Vacancy struct {
	ID           string    `json:"_id"`
	ProjectTitle string    `json:"projectTitle"`
	Title        string    `json:"title"` // duplicate of ProjectTitle for legacy support
	ProfessorName string   `json:"professorName"`
	Department   string    `json:"department"`
	Description  string    `json:"description"`
	Eligibility  string    `json:"eligibility"`
	Stipend      string    `json:"stipend"`
	Deadline     *string   `json:"deadline"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// VacancyInput is what the POST body must contain.
type VacancyInput struct {
	ProjectTitle  string `json:"projectTitle"`
	ProfessorName string `json:"professorName"`
	Department    string `json:"department"`
	Description   string `json:"description"`
	Eligibility   string `json:"eligibility"`
	Stipend       string `json:"stipend"`
	Deadline      string `json:"deadline"`
}

// ─────────────────────────────────────────────
// International Internship
// ─────────────────────────────────────────────

// Internship mirrors the MongoDB international_internships collection.
type Internship struct {
	ID                     string    `json:"_id"`
	UniversityName         string    `json:"universityName"`
	InternshipProgramName  string    `json:"internshipProgramName"`
	Country                string    `json:"country"`
	ApplicationLink        string    `json:"applicationLink"`
	Eligibility            string    `json:"eligibility"`
	Deadline               *string   `json:"deadline"`
	CreatedAt              time.Time `json:"createdAt"`
	UpdatedAt              time.Time `json:"updatedAt"`
}

// InternshipInput is what the POST body must contain.
type InternshipInput struct {
	UniversityName        string `json:"universityName"`
	InternshipProgramName string `json:"internshipProgramName"`
	Country               string `json:"country"`
	ApplicationLink       string `json:"applicationLink"`
	Eligibility           string `json:"eligibility"`
	Deadline              string `json:"deadline"`
}

// ─────────────────────────────────────────────
// Event
// ─────────────────────────────────────────────

// Event mirrors the MongoDB events collection.
type Event struct {
	ID          string    `json:"_id"`
	Title       string    `json:"title"`
	Sender      string    `json:"sender"`
	Category    string    `json:"category"`
	Description string    `json:"description"`
	Date        *string   `json:"date"`
	Time        *string   `json:"time"`
	Venue       *string   `json:"venue"`
	Link        *string   `json:"link"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// EventInput is what the POST body must contain.
type EventInput struct {
	Title       string `json:"title"`
	Sender      string `json:"sender"`
	Category    string `json:"category"`
	Description string `json:"description"`
	Date        string `json:"date"`
	Time        string `json:"time"`
	Venue       string `json:"venue"`
	Link        string `json:"link"`
}

// ─────────────────────────────────────────────
// JWT Claims
// ─────────────────────────────────────────────

// JWTClaims carries the user payload inside the signed token.
type JWTClaims struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}
