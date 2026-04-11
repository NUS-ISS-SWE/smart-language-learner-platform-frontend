# smart-language-learner-platform-frontend

A **Next.js 16** frontend for the Smart Language Learner Platform, connecting to a Java Spring Boot microservices backend.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| HTTP client | Axios |
| Auth | JWT (stored in `localStorage` + `sllp_auth` cookie for middleware) |

## Project structure

```
app/
├── (auth)/login        – Login page
├── (auth)/register     – Registration page
├── (main)/dashboard    – User dashboard with enrolled-course stats
├── (main)/courses      – Course catalogue + detail page
├── (main)/vocabulary   – Vocabulary set browser
├── layout.tsx          – Root layout (wraps AuthProvider)
└── page.tsx            – Public landing page

components/
├── ui/                 – Button, Card, Input, Badge, LoadingSpinner
├── layout/             – Navbar, Sidebar
└── features/           – CourseCard, LessonCard, VocabCard

lib/api/
├── client.ts           – Axios instances for each microservice + token helpers
├── auth.ts             – login / register / logout / getCurrentUser
├── courses.ts          – CRUD for courses + enrollment
├── lessons.ts          – Lessons per course
└── vocabulary.ts       – Vocabulary sets & items

types/                  – TypeScript interfaces (auth, course, lesson, vocabulary)
context/AuthContext.tsx – React context + useAuth() hook
middleware.ts           – Route-protection via Next.js middleware
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure microservice URLs
cp .env.example .env.local
# Edit .env.local and point the URLs at your running Spring Boot services

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend microservices

The frontend expects the following Spring Boot services (defaults in `.env.example`):

| Service | Default URL | Key endpoints |
|---|---|---|
| Auth | `http://localhost:8081` | `POST /api/auth/login`, `POST /api/auth/register` |
| User | `http://localhost:8082` | `GET /api/users/me` |
| Course | `http://localhost:8083` | `GET /api/courses`, `GET /api/courses/:id/lessons` |
| Vocabulary | `http://localhost:8084` | `GET /api/vocabulary/sets` |

Override any URL via the corresponding `NEXT_PUBLIC_*_SERVICE_URL` variable in `.env.local`.

## Available scripts

```bash
npm run dev    # development server
npm run build  # production build
npm run start  # production server
npm run lint   # ESLint
```
