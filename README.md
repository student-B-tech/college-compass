# College Compass

College Compass is a full-stack college discovery platform that helps students explore, search, filter, compare, and save colleges in one place.

## Features

- User registration and login
- Secure login/logout flow
- Protected college data
- College search
- Filter colleges by type and course
- Filter by minimum rating
- Sort by rating, name, and fees
- Pagination for college listings
- View detailed college information
- Compare up to 4 colleges
- Save favorite colleges
- Responsive user interface
- PostgreSQL database integration
- Admin functionality for managing college data

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- TypeScript
- Prisma ORM

### Database
- PostgreSQL
- Neon PostgreSQL

### Authentication
- Cookie-based authentication
- Protected API routes
- Login and logout functionality

## Project Structure

```text
college-compass/
├── app/
│   ├── admin/
│   ├── api/
│   │   ├── auth/
│   │   └── colleges/
│   ├── college/
│   ├── compare/
│   ├── login/
│   ├── register/
│   ├── saved/
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   └── prisma.ts
│
├── prisma/
│
├── public/
│
├── .env
├── package.json
└── README.md