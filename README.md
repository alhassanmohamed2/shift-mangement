# Shift Management System

A full-stack, visually rich shift management web application for an IT support team.
Built with Next.js 14, Tailwind CSS, Framer Motion, FastAPI, and PostgreSQL.

## Features
- **Animated Live Office Scene**: Visualizes the current active shift with character avatars.
- **Weekly Schedule**: Overview of shifts and assignments with inline status validation.
- **Audit Logs**: History of assignments, removals, and swaps.
- **Admin Panel**: Manage team members and drag-and-drop or select to assign shifts.
- **Role-based Auth**: Admin and Member access levels using JWT.

## Prerequisites
- Docker and Docker Compose

## Quick Start

1. Start the application:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost:3000
- Backend API (Swagger UI): http://localhost:8000/docs
- Adminer (Database UI): http://localhost:8080

### Default Accounts
On the first run, the database is automatically seeded with an admin account:
- **Email:** admin
- **Password:** admin

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, Axios, React Hot Toast
- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL, Passlib (bcrypt)
- **Containerization**: Docker Compose
