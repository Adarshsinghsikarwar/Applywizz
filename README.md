# Recruiter Job Portal — Take-Home Submission

A full-stack MERN application that lets a recruiter search, analyze, and manage
job postings from a raw dataset — with data cleaning and duplicate detection
built in.

Submitted for: **Entry-Level Software Engineer — Applywizz Technologies Pvt. Ltd.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Frontend | React (Vite), Tailwind CSS, Recharts, React Router |
| Data import | SheetJS (xlsx) |

---

## Project Structure

```
.
├── backend/            Express + MongoDB API
│   ├── src/
│   │   ├── config/       env & DB connection
│   │   ├── models/        Mongoose schemas
│   │   ├── repositories/   database queries
│   │   ├── services/        business logic (search, analytics, duplicate detection)
│   │   ├── controllers/      HTTP handlers
│   │   ├── routes/            Express routers
│   │   ├── middlewares/        error handling, validation
│   │   ├── validators/          request validation rules
│   │   ├── utils/                normalization, sanitization, parsing helpers
│   │   └── scripts/               dataset import & duplicate detection scripts
│   ├── data/Jobs_Dataset.xlsx
│   └── README.md
│
└── frontend/           React (Vite) client
    ├── src/
    │   ├── app/            routing & layout
    │   ├── shared/          reusable UI, hooks, API client, formatters
    │   └── features/
    │       ├── jobs/          job search & details
    │       ├── analytics/      dashboard
    │       └── duplicates/      duplicate review workflow
    └── README.md
```

Each feature on the frontend follows a **four-layer architecture**:
`domain` (business logic) → `infrastructure` (API calls) → `application`
(state/hooks) → `presentation` (components/pages). The backend follows a
standard layered architecture: `routes → controllers → services → repositories → models`.

---

## Features

### Backend
- Dataset import pipeline that cleans, normalizes, and loads the raw
  `Jobs_Dataset.xlsx` into MongoDB
- REST APIs to search, filter, sort, and paginate job postings
- Analytics endpoint powering dashboard metrics
- Duplicate detection — exact match (URL, normalized title+company+location)
  and near-duplicate detection (similarity scoring) — with a review workflow
  API to confirm/reject/merge flagged duplicates
- Input validation, centralized error handling, and consistent API responses

### Frontend
- **Dashboard** — total jobs, companies, duplicate rate, breakdowns by
  department/employment type/experience level/work mode, 30-day posting trend
- **Job Search** — debounced keyword search, multi-filter, sort, pagination
- **Job Details** — full posting information
- **Duplicate Review** — grouped duplicate postings with per-job review status
  and a button to re-run detection

---

## Data Cleaning & Duplicate Detection Approach

The raw dataset (10,000 rows) has real-world data quality issues by design:
missing fields across most columns, inconsistent categorical values (14
variants of experience level alone), invalid dates, unreliable salary strings,
and inconsistent location formats. Rather than dropping problematic rows, the
import pipeline:

- Normalizes categorical fields (experience level, employment type, department,
  work mode, apply type) into a fixed set of values
- Safely parses dates and salaries, flagging invalid/unparseable values instead
  of crashing
- Sanitizes HTML in job descriptions before storage
- Parses location strings into city/state/country where possible
- Tracks a `dataQuality` flag per job noting which fields were missing or
  invalid, so the frontend can surface incomplete records transparently

Duplicate detection runs three signals — exact URL match, exact normalized
content match, and near-duplicate similarity scoring within blocked groups —
merged via a union-find structure so each job belongs to exactly one group.
Every duplicate group has one "primary" record and a per-job review status
(`unreviewed`, `confirmed_duplicate`, `not_duplicate`, `merged`).

Full technical detail is in `backend/README.md`.

---

## Setup & Installation

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI

npm run import              # cleans and imports the dataset, then runs duplicate detection
npm run dev                  # starts the API at http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if the backend isn't running on the default URL

npm run dev                  # starts the app at http://localhost:5173
```

Open `http://localhost:5173` in a browser. The backend must be running first.

---

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/jobs` | Search/filter/sort/paginate jobs |
| GET | `/api/jobs/:id` | Get a single job's full details |
| GET | `/api/jobs/filters/options` | Get available filter values |
| GET | `/api/analytics/dashboard` | Dashboard metrics |
| GET | `/api/duplicates` | List duplicate groups |
| PATCH | `/api/duplicates/:jobId/review` | Update a job's duplicate review status |
| POST | `/api/duplicates/detect` | Re-run duplicate detection |
| GET | `/api/health` | Health check |

Full request/response shapes are documented in `backend/README.md`.

---

## Known Limitations

- Salary data in the source dataset only has 5 distinct raw values, so salary
  filtering/display is best-effort rather than precise
- Location normalization covers US states and the Indian states present in
  this dataset; it isn't a general-purpose geocoder
- Near-duplicate detection uses blocking for performance — two postings with
  both a different title *and* a different company won't be flagged, by design