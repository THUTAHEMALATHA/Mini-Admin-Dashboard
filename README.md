# Job Listings Admin Dashboard

A modern Admin Dashboard for managing job listings built with React and Supabase.

## 🚀 Live Demo

[Add your Lovable live link here]

## 📋 Features

### Core Features

- **Authentication**: Secure admin login using Supabase Auth
- **Job Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Dashboard UI**: Clean interface with sidebar navigation
- **Job Table**: Sortable table view with all job listings

### Bonus Features

- 🔍 Search/Filter jobs by title, location, or type
- 📄 Pagination for large datasets
- 🔔 Toast notifications for user actions
- ✅ Form validation on job creation/editing

### Task 2: Save Job Feature

- ⭐ Users can save jobs to their favorites
- 📌 View saved jobs list
- 🗑️ Remove jobs from saved list

## 🏗️ Architecture

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.jsx
│   ├── Dashboard/
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   ├── Jobs/
│   │   ├── JobList.jsx
│   │   ├── JobForm.jsx
│   │   └── JobTable.jsx
│   └── SavedJobs/
│       └── SavedJobsList.jsx
├── lib/
│   └── supabase.js
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── SavedJobs.jsx
└── App.jsx
```

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Supabase (Auth + Database)
- **Styling**: CSS Modules / Tailwind
- **State Management**: React Context

## 📦 Database Schema

### jobs table

| Column     | Type      | Description                    |
| ---------- | --------- | ------------------------------ |
| id         | uuid      | Primary key                    |
| title      | text      | Job title                      |
| salary     | text      | Salary range                   |
| location   | text      | Job location                   |
| type       | text      | Job type (full-time/part-time) |
| created_at | timestamp | Creation timestamp             |

### saved_jobs table

| Column     | Type      | Description               |
| ---------- | --------- | ------------------------- |
| id         | uuid      | Primary key               |
| user_id    | uuid      | Foreign key to auth.users |
| job_id     | uuid      | Foreign key to jobs       |
| created_at | timestamp | When saved                |

## 📝 Decisions Taken

1. **Supabase Auth**: Used Supabase's built-in authentication for secure admin access
2. **Row Level Security**: Enabled RLS on all tables for data protection
3. **Real-time subscriptions**: Added for live updates when jobs are modified
4. **Optimistic UI**: Immediate feedback while async operations complete

## 🔧 Improvements

- [ ] Add user roles (admin vs regular user)
- [ ] Implement job application tracking
- [ ] Add analytics dashboard
- [ ] Export jobs to CSV/Excel
- [ ] Email notifications for new jobs
- [ ] Dark mode support

## 📄 Submission

- **Live Link**: [Your Lovable URL]
- **GitHub Repo**: [Your GitHub URL]
- **Documentation**: This file
