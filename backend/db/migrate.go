package db

import "log"

// Migrate creates all required tables if they do not yet exist,
// then seeds the four admin accounts on first boot.
func Migrate() {
	createTables()
	seedAdmins()
}

func createTables() {
	queries := []string{
		// users table — supports roles: admin (owner) and manager (wing coordinators)
		`CREATE TABLE IF NOT EXISTS users (
			id          SERIAL PRIMARY KEY,
			email       TEXT NOT NULL UNIQUE,
			password    TEXT NOT NULL,
			role        TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'manager')),
			created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,

		// professors table
		`CREATE TABLE IF NOT EXISTS professors (
			id                   SERIAL PRIMARY KEY,
			name                 TEXT NOT NULL,
			email                TEXT NOT NULL,
			department           TEXT NOT NULL,
			designation          TEXT,
			research_interests   TEXT[],
			lab_website          TEXT,
			profile_image_url    TEXT,
			google_scholar_url   TEXT,
			is_accepting_students BOOLEAN NOT NULL DEFAULT FALSE,
			created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,

		// project_vacancies table
		`CREATE TABLE IF NOT EXISTS project_vacancies (
			id             SERIAL PRIMARY KEY,
			project_title  TEXT NOT NULL,
			professor_name TEXT NOT NULL,
			department     TEXT NOT NULL,
			description    TEXT NOT NULL,
			eligibility    TEXT NOT NULL,
			stipend        TEXT NOT NULL,
			deadline       DATE,
			is_active      BOOLEAN NOT NULL DEFAULT TRUE,
			created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,

		// international_internships table
		`CREATE TABLE IF NOT EXISTS international_internships (
			id                      SERIAL PRIMARY KEY,
			university_name         TEXT NOT NULL,
			internship_program_name TEXT NOT NULL,
			country                 TEXT NOT NULL,
			application_link        TEXT NOT NULL,
			eligibility             TEXT,
			deadline                DATE,
			created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,

		// events table
		`CREATE TABLE IF NOT EXISTS events (
			id          SERIAL PRIMARY KEY,
			title       TEXT NOT NULL,
			sender      TEXT NOT NULL DEFAULT 'Research Wing, AnC',
			category    TEXT NOT NULL CHECK (category IN ('Event', 'Notice', 'Urgent')),
			description TEXT NOT NULL,
			date        DATE,
			time        TEXT,
			venue       TEXT,
			link        TEXT,
			created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
	}

	for _, q := range queries {
		if _, err := DB.Exec(q); err != nil {
			log.Fatalf("Migration failed: %v\nQuery: %s", err, q)
		}
	}

	log.Println("Database migration completed.")
}

// adminSeed holds the data for every admin that must exist at startup.
// Passwords are bcrypt hashes (cost 10).
//
//   Anshu       anshus24@iitk.ac.in      Anshu@7341
//   Antriksh    antrikshs24@iitk.ac.in   Antriksh@8629
//   Neha        ensri24@iitk.ac.in       Neha@5182
//   Raj (owner) rajc25@iitk.ac.in        de325ut
type adminSeed struct {
	email string
	hash  string
	role  string // "admin" (owner) or "manager"
}

var defaultAdmins = []adminSeed{
	// ── Managers (wing coordinators) ────────────────────────────────────────
	{
		email: "anshus24@iitk.ac.in",
		hash:  "$2a$10$gBh1W5lrh6OaEf4n4kiRoOo/nDjcEN0mAqT0BhEWeMJPchhmo.38W",
		role:  "manager",
	},
	{
		email: "antrikshs24@iitk.ac.in",
		hash:  "$2a$10$qcgD0PIzEkeDJ7jkS6RwZupqPS7epqkx9JoFJ3/0Rb28I7I2z/jPi",
		role:  "manager",
	},
	{
		email: "ensri24@iitk.ac.in",
		hash:  "$2a$10$dvd3kbTNIDSwFDbruuyIW.qGKS.IrngY8aqD1zvxYSoSQQi5u7ukK",
		role:  "manager",
	},
	// ── Owner / super-admin ─────────────────────────────────────────────────
	{
		email: "rajc25@iitk.ac.in",
		hash:  "$2a$10$Nxf2/IjWfrwbj88ccvOeJOMwsBac6l6yrNnzzpJX5MYkEFq.4yaf2",
		role:  "admin",
	},
}

// seedAdmins upserts every entry in defaultAdmins so the table always
// contains all required accounts, even after a fresh volume wipe.
// Existing rows (matched by email) are left untouched.
func seedAdmins() {
	for _, a := range defaultAdmins {
		var exists bool
		err := DB.QueryRow(
			"SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", a.email,
		).Scan(&exists)
		if err != nil {
			log.Printf("Seed check failed for %s: %v", a.email, err)
			continue
		}
		if exists {
			log.Printf("Admin already seeded, skipping: %s", a.email)
			continue
		}

		_, err = DB.Exec(
			"INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
			a.email, a.hash, a.role,
		)
		if err != nil {
			log.Printf("Could not seed admin %s: %v", a.email, err)
			continue
		}
		log.Printf("Seeded admin [%s]: %s", a.role, a.email)
	}
}
