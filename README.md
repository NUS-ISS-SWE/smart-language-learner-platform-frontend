# Smart Language Learner Platform - Frontend

A modern Next.js-based frontend for the Smart Language Learner Platform, offering interactive language learning with AI-powered composition evaluation, vocabulary building, and progress tracking.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Styling**: Tailwind CSS 4
- **State Management**: React Context + Hooks
- **API Communication**: Axios
- **Internationalization**: i18next
- **Testing**: Jest + React Testing Library

## Project Structure

```
app/                          # Next.js App Router
├── (auth)/                    # Authentication routes (login, register)
├── (main)/                    # Main application routes
│   ├── dashboard/             # User dashboard
│   ├── courses/               # Course listing and details
│   ├── vocabulary/            # Vocabulary practice
│   ├── evaluations/           # Evaluation viewing
│   ├── progress/              # Learning progress
│   └── profile/               # User profile
├── admin/                     # Admin dashboard
├── evaluation/                # Evaluation routes
├── compositions/              # Written compositions
├── knowledge/                 # Knowledge base
├── settings/                  # User settings
└── layout.tsx                 # Root layout

components/
├── features/                  # Feature-specific components
│   ├── CourseCard.tsx
│   ├── LessonCard.tsx
│   └── VocabCard.tsx
├── layout/                    # Layout components
│   ├── Navbar.tsx
│   └── Sidebar.tsx
├── ui/                        # Reusable UI components
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── BaseCard.tsx
│   ├── FeatureStub.tsx
│   └── ErrorDisplay.tsx
└── providers/                 # Context providers
    └── I18nProvider.tsx

lib/
├── api/                       # API clients and utilities
│   ├── client.ts              # Axios instances and helpers
│   ├── auth.ts                # Authentication endpoints
│   ├── courses.ts             # Course endpoints
│   ├── lessons.ts             # Lesson endpoints
│   ├── vocabulary.ts          # Vocabulary endpoints
│   ├── compositions.ts        # Composition endpoints
│   ├── evaluations.ts         # Evaluation endpoints
│   ├── rubrics.ts             # Rubric endpoints
│   └── utils.ts               # API utility helpers
├── hooks/                     # Custom React hooks
│   ├── useAuth.ts             # Auth context hook
│   ├── useFetch.ts            # Generic data fetching
│   ├── usePagination.ts       # Pagination logic
│   ├── useLocalStorage.ts     # Local storage persistence
│   ├── useAsync.ts            # Async operation handling
│   └── useAuthForm.ts         # Form submission handling
├── config/                    # Configuration
│   ├── constants.ts           # App constants
│   └── i18n/                  # i18n configuration
└── utils/                     # Utility functions

context/
└── AuthContext.tsx            # Authentication context

types/
├── auth.ts                    # Auth types
├── course.ts                  # Course types
├── lesson.ts                  # Lesson types
├── vocabulary.ts              # Vocabulary types
├── composition.ts             # Composition types
├── evaluation.ts              # Evaluation types
├── rubric.ts                  # Rubric types
└── common.ts                  # Shared types

public/                        # Static assets
```

## Setup & Installation

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation Steps

```bash
# Install dependencies
npm install

# Create environment configuration
cp .env.example .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8080/api/auth

# Feature Flags
NEXT_PUBLIC_ENABLE_ADMIN=true
NEXT_PUBLIC_ENABLE_EVALUATION=true
NEXT_PUBLIC_ENABLE_COMPOSITIONS=true

# Internationalization
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,zh

# Other
NODE_ENV=development
```

**⚠️ Important**: Never commit `.env.local` to version control. Use `.env.example` as a template.

## Development

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Format code with Prettier
npm run format
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

## Key Features

### Authentication
- User login/registration with JWT
- Protected routes with automatic redirection
- Session persistence with local storage
- Auto-logout on token expiration

### Learning Interface
- **Courses**: Browse and enroll in language courses
- **Lessons**: Interactive lesson content with multiple types (video, reading, quiz, exercise, composition)
- **Vocabulary**: Flashcard-based vocabulary practice
- **Compositions**: Write and submit written work for evaluation
- **Progress Tracking**: Monitor learning progress with analytics

### Evaluation System
- **Rubric-based Grading**: Structured evaluation criteria
- **Instructor Feedback**: Detailed feedback on student work
- **Revision Requests**: Request improvements on submissions
- **Evaluation History**: Track all evaluations and feedback

### Admin Features
- Course and content management
- Rubric creation and publishing
- User management
- Analytics and reporting

### Internationalization
- Support for multiple languages (English, Chinese)
- Language selection in user profile
- Dynamic content translation
- RTL-aware UI components

## API Integration

The frontend communicates with the backend through REST APIs grouped by domain:

### API Endpoints Structure
```
/api/auth/               # Authentication
/api/courses/            # Course management
/api/lessons/            # Lesson content
/api/vocabulary/         # Vocabulary
/api/compositions/       # Written works
/api/evaluations/        # Grading
/api/rubrics/            # Evaluation criteria
```

### Error Handling
- Global error boundaries for UI failures
- User-friendly error messages
- Automatic retry logic for transient failures
- Proper HTTP status code handling

## Performance Optimization

- **Code Splitting**: Route-based automatic code splitting with Next.js
- **Image Optimization**: Using next/image for all images
- **Server Components**: React Server Components for reduced JS bundle
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: Strategic use of Next.js caching and revalidation

## Accessibility

The application follows WCAG 2.1 AA standards:
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (4.5:1)
- Focus indicators on interactive elements

## Git Workflow

### Branch Naming Convention
- `feature/ISSUE-123-description` - New features
- `bugfix/ISSUE-456-description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation

### Commit Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add JWT refresh token rotation
fix(courses): return 404 instead of 500 when course not found
refactor(components): extract button logic to reusable hook
docs(api): update API documentation
```

## Common Issues & Troubleshooting

### Build Failures

**Issue**: TypeScript errors during build
**Solution**: Run `npm run type-check` to identify issues, fix type errors

**Issue**: Module not found errors
**Solution**: Clear `.next` directory and reinstall: `rm -rf .next node_modules && npm install`

### Runtime Issues

**Issue**: Authentication token expired
**Solution**: Log out and log back in, or refresh the page

**Issue**: API calls failing with CORS errors
**Solution**: Ensure backend CORS configuration allows frontend origin

### Development Issues

**Issue**: Hot module reload not working
**Solution**: Restart dev server: `npm run dev`

**Issue**: Dependency conflicts
**Solution**: Run `npm dedupe` and reinstall dependencies

## Contributing

1. Create a feature branch from `develop`
2. Make your changes following the code standards
3. Write/update tests for your changes
4. Submit a pull request with clear description
5. Ensure all checks pass before merging

## Code Standards

### TypeScript
- Strict mode enabled (`strict: true`)
- No use of `any` type - use `unknown` and narrow types
- Explicit return types on all functions
- Interface for props, types for utilities

### React
- Functional components only
- Hooks for state management
- Memoization only when necessary
- Proper key usage in lists
- Server components by default

### Styling
- Utility-first with Tailwind CSS
- No custom CSS unless necessary
- Consistent spacing and sizing
- Mobile-first responsive design
- Dark mode support

### File Organization
- One component per file (unless very small)
- Barrel exports for directories
- Clear separation of concerns
- Co-locate related files
- Logical folder structure

## Debugging

### Browser DevTools
- Use React DevTools extension for component inspection
- Check Network tab for API calls
- Check Console for error messages

### VS Code Debugging
- Install Debugger for Chrome/Firefox
- Use launch.json configuration
- Set breakpoints in editor
- Step through code execution

## Performance Monitoring

Monitor key metrics:
- **FCP** (First Contentful Paint): Target < 1.8s
- **LCP** (Largest Contentful Paint): Target < 2.5s
- **CLS** (Cumulative Layout Shift): Target < 0.1
- **Bundle Size**: Monitor with `npm run analyze`

## Deployment

### Deployment Platforms
- Vercel (recommended for Next.js)
- AWS Amplify
- Docker containers
- Traditional servers with Node.js

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Env variables configured
- [ ] Build completes successfully
- [ ] Bundle size analyzed
- [ ] No console errors/warnings

## License

[Specify your license here]

## Support & Documentation

- Backend API Documentation: See backend README
- Architecture Decisions: See `/docs/adr/`
- Troubleshooting: See sections above and open an issue

---

**Last Updated**: April 11, 2026  
**Next.js Version**: 16  
**TypeScript Version**: 5  
**Node Version**: 20+
