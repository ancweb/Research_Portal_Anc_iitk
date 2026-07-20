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

var validCategories = map[string]bool{
	"Event":  true,
	"Notice": true,
	"Urgent": true,
}

// GetEvents handles GET /api/events
// Returns all events sorted by created_at descending (newest first).
func GetEvents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.DB.Query(`
		SELECT id, title, sender, category, description,
		       date, time, venue, link, created_at, updated_at
		FROM events
		ORDER BY created_at DESC
	`)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var events []models.Event
	for rows.Next() {
		var e models.Event
		var id int
		var date *time.Time
		var timeStr, venue, link *string
		var createdAt, updatedAt time.Time

		err := rows.Scan(
			&id, &e.Title, &e.Sender, &e.Category, &e.Description,
			&date, &timeStr, &venue, &link, &createdAt, &updatedAt,
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		e.ID = fmt.Sprintf("%d", id)
		e.CreatedAt = createdAt
		e.UpdatedAt = updatedAt
		e.Time = timeStr
		e.Venue = venue
		e.Link = link

		if date != nil {
			ds := date.Format("2006-01-02")
			e.Date = &ds
		}

		events = append(events, e)
	}

	if events == nil {
		events = []models.Event{}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(events)
}

// CreateEvent handles POST /api/events (protected by Auth middleware)
func CreateEvent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input models.EventInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body."})
		return
	}

	input.Title = strings.TrimSpace(input.Title)
	input.Category = strings.TrimSpace(input.Category)
	input.Description = strings.TrimSpace(input.Description)
	input.Venue = strings.TrimSpace(input.Venue)
	input.Link = strings.TrimSpace(input.Link)
	input.Time = strings.TrimSpace(input.Time)

	sender := strings.TrimSpace(input.Sender)
	if sender == "" {
		sender = "Research Wing, AnC"
	}

	if input.Title == "" || input.Category == "" || input.Description == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Title, category, and description are required."})
		return
	}

	if !validCategories[input.Category] {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Category must be one of: Event, Notice, Urgent."})
		return
	}

	var deadline *string
	if d := strings.TrimSpace(input.Date); d != "" {
		if _, err := time.Parse("2006-01-02", d); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Date must be a valid date (YYYY-MM-DD)."})
			return
		}
		deadline = &d
	}

	var timeVal, venueVal, linkVal *string
	if input.Time != "" {
		timeVal = &input.Time
	}
	if input.Venue != "" {
		venueVal = &input.Venue
	}
	if input.Link != "" {
		linkVal = &input.Link
	}

	var id int
	var createdAt, updatedAt time.Time
	err := db.DB.QueryRow(`
		INSERT INTO events (title, sender, category, description, date, time, venue, link)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at
	`, input.Title, sender, input.Category, input.Description,
		deadline, timeVal, venueVal, linkVal,
	).Scan(&id, &createdAt, &updatedAt)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	event := models.Event{
		ID:          fmt.Sprintf("%d", id),
		Title:       input.Title,
		Sender:      sender,
		Category:    input.Category,
		Description: input.Description,
		Date:        deadline,
		Time:        timeVal,
		Venue:       venueVal,
		Link:        linkVal,
		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(event)
}
