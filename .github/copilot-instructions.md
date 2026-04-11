# Copilot Instructions

Smart Language Learner Platform — Master instruction file for GitHub Copilot.
Covers code quality, architecture, security, and standards for a **Java 25 (Spring Boot 4) + Next.js 16 (React 19, TypeScript 5) stack**.

---

## 1. Code quality & standards

### General
- Use descriptive, domain-specific names; avoid abbreviations except universally understood ones (`id`, `url`, `ctx`, `dto`, `dto`, `api`)
- Write small, single-responsibility functions — aim for under 40 lines
- Use early returns and guard clauses to avoid deep nesting; maximum two levels of nesting
- No magic numbers or strings; define named constants, enums, or config objects
- Remove dead code, unused imports, commented-out code, and debug logging before finishing
- Never suppress warnings (e.g. `@SuppressWarnings`, `eslint-disable`) without an inline comment explaining why
- Add meaningful comments only for non-obvious logic; self-documenting code is preferred

### Java 25 (Spring Boot 4.0.5)
- Follow standard Spring Boot 4 layering: Controller → Service → Repository; do not skip layers
- Use `record` types (fully stabilized) for immutable DTOs and configuration objects; prefer records over classes for data carriers
- Use `Optional<T>` instead of returning `null` from service methods; handle `Optional` at the service layer boundary
- Use sealed classes and interfaces for domain models where polymorphism is restricted
- Apply pattern matching in conditionals for cleaner type narrowing (e.g. `if (record instanceof User user)`)
- Prefer constructor injection over field injection; use `@RequiredArgsConstructor` from Lombok to avoid boilerplate
- Use `@Slf4j` for logging; never use `System.out.println` or `System.err.println`
- DTOs must be used at REST endpoints; never expose JPA entities directly in API responses
- Mark `@Transactional` **only** at the service layer; use `readOnly=true` for read-only operations
- Use virtual threads (`@EnableVirtualThreads` on `@Bean` or via ExecutorService) for I/O-bound tasks; do not use if CPU-bound
- Use Java 25's record pattern matching for destructuring in method parameters and switch expressions

### Next.js 16 (React 19 + TypeScript 5)
- All components must be strictly typed with TypeScript; **no use of `any` or `Object` types**
- Use Server Components by default; mark Client Components with `"use client"` directive only when necessary (state, hooks, browser APIs)
- Keep components focused — if a component exceeds ~150 lines, consider splitting; favour composition over monolithic components
- Co-locate component state as low as possible; lift state only when multiple components depend on it
- Use TypeScript interfaces for component props; document required vs optional props
- Use named exports for components; default exports are acceptable only for page routes
- Error boundaries must wrap feature sections; use `error.tsx` for route segments and `global-error.tsx` for app-level errors
- Use Next.js built-in routing features (dynamic routes, layouts, middleware) instead of client-side routing
- Leverage `next/image` for all images; never use `<img>` directly (violates optimization)
- Use Tailwind CSS utility classes exclusively; do not write custom CSS unless impossible with Tailwind
- Ensure all interactive elements are accessible (WCAG AA standard minimum; use `aria-label`, `role`, semantic HTML)
- Use the proxy pattern or API route handlers for backend communication; never expose internal URLs to clients

### Tailwind CSS 4
- Use utility-first approach exclusively; avoid custom CSS classes unless Tailwind utilities cannot solve the requirement
- Organize responsive breakpoints intentionally (`sm:`, `md:`, `lg:`); mobile-first by default
- Extract reusable component utilities into `@apply` blocks only when DRY principle is violated across 3+ components
- Use Tailwind's built-in color palette; define theme extensions in `tailwind.config.ts` for custom colors or design tokens
- Apply dark mode support using `dark:` variant for UI components that require it

### TypeScript 5
- Use strict mode in `tsconfig.json`: `"strict": true`; all inferred types must be explicit
- Use union types and discriminated unions for type-safe error handling instead of exceptions where applicable
- Prefer `const` assertions for literal types; use `as const` for string literals used as keys
- Use exhaustiveness checking in switch statements with TypeScript's type narrowing
- Define shared types in `types/` directory; export from barrel files (`index.ts`) to simplify imports
- Use `unknown` instead of `any` when type information is unavailable; always narrow before use
- Use generics sparingly and only when necessary; prefer concrete types for readability

---

## 2. Architecture & implementation constraints

### Project structure
- Backend: Multiple Spring Boot microservices under `sllp-*` modules; each service is independently deployable
- Frontend: Next.js app router structure — features mirror backend service boundaries where possible
- Shared: Type definitions in `frontend/types/` align with backend DTOs; backend `models` map to frontend `types`
- Database migrations: Use Liquibase via `sllp-liquibase-service`; never commit raw SQL migrations without changelog entries
- API Gateway: All backend communication flows through `sllp-api-gateway`; do not bypass to direct service URLs

### Backend architecture
- **Layering**: Controller (HTTP only) → Service (business logic) → Repository (data access)
- Repositories: Only `@Repository` classes interact directly with JPA; use Spring Data `JpaRepository`
- Services: Contain all business logic; handle transactions, validation, and coordination
- Controllers: Request/response mapping only; delegate immediately to services
- Entities: Mark as `@Entity` in repositories; never expose directly in API responses
- **Do not** share domain entities between services; use DTOs for inter-service communication
- Configuration: Store in `application.yaml` or `application-{profile}.yaml`; externalize environment-specific values to properties or Secrets Manager

### Frontend architecture
- **App Router**: Use `(grouped)` layout folders for semantic grouping; pages must be in `app/` directory
- API calls: Must route through `lib/api/` service layer; never call backends directly from components
- Hooks: Create custom hooks in `lib/hooks/` for reusable logic (data fetching, state management)
- Context: Use `context/` for global state only (auth, user session); prefer `useContext` + local state for subtree state
- Types: Define in `types/` and import across frontend; keep in sync with backend DTOs

### Dependencies & imports
- **Do not introduce new dependencies without FLAG FIRST** — ask in commit body or comment
- Backend: When adding JARs, check for Spring Boot starter equivalents first; minimize transitive dependencies
- Frontend: Use officially maintained packages; prioritize packages with 50k+ weekly downloads and active maintenance (unless critical)
- Avoid duplicate functionality: Spring Boot auto-configuration includes common tools; React ecosystem favors specific libraries (e.g., native `fetch` over axios where possible)
- Frontend: Prefer Next.js built-ins (`next/image`, `next/link`) over external packages

### Database access patterns
- Use JPA/JPQL for all queries; write raw SQL only if JPA cannot express the query (flag with `/* RAW SQL: <reason> */` comment)
- Leverage Spring Data repositories with `@Query` annotations for complex queries
- Use Liquibase changelogs for schema versions; never hardcode migration logic in Java
- Mark read-only service methods with `@Transactional(readOnly=true)` for performance hints

### Error handling & validation
- **Backend**: Throw domain-specific exceptions (e.g., `UserNotFoundException`, `InvalidCredentialsException`) with meaningful messages
- **Frontend**: Catch and handle errors at the page/route level; display generic user-friendly messages; log technical details server-side
- Use `@Validated` on controllers with `@Valid` on DTOs for automatic bean validation
- Return appropriate HTTP status codes: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error), 503 (Service Unavailable)
- Never leak stack traces or internal details to clients; always catch and transform exceptions into structured error responses

### Configuration & secrets
- Environment-specific config in separate `application-{profile}.yaml` files (dev, staging, prod)
- **Never hardcode**: API keys, database credentials, JWT secrets, service URLs, AWS resource identifiers
- Use environment variables or Secrets Manager for all secrets; inject via Spring properties or Next.js `.env.local`
- Ensure `.env.local`, `.env.*.local`, and `application-local.properties` are in `.gitignore`
- Backend: Use `@Value` or `@ConfigurationProperties` for type-safe configuration classes

---

## 3. Testing & code quality

### Unit testing
- **Backend**: JUnit 5 + Mockito for unit tests; aim for >80% coverage on critical paths (auth, business logic)
- **Backend**: Use `@SpringBootTest` sparingly; prefer focused `@WebMvcTest` for controllers and `@DataJpaTest` for repositories
- **Frontend**: Jest + React Testing Library for component tests; test behavior, not implementation details
- **Frontend**: Avoid snapshot tests unless UI structure is intentionally restrictive; prefer explicit assertions
- Mark flaky tests with `@Flaky(ticket = "#123")`; investigate and fix before merging
- mock external dependencies (APIs, databases, services); never test against live systems in unit tests

### Integration testing
- Test inter-service communication or critical workflows; use containers (Testcontainers) for database integration
- Backend: Use `@SpringBootTest` with embedded test database or docker container
- Keep integration tests separate from unit tests in a `integration/` test directory
- Use realistic test data; avoid overly mocked scenarios that hide real bugs

### Test data & fixtures
- Create reusable test fixtures or builders (e.g., `UserBuilder`, `CourseBuilder`); avoid duplicated test setup
- Use `@BeforeEach` for per-test setup; `@BeforeAll` for expensive shared resources (containers, fixtures)
- Backend: Use Liquibase test changesets or in-memory H2 database for repeatable test data

### Debugging & logging
- Enable detailed logging in test environments; suppress in production
- Use SLF4J + Logback for structured logging; include context (user ID, request ID, service name)
- Log at appropriate levels: `DEBUG` for development, `INFO` for events, `WARN` for unexpected but recoverable, `ERROR` for failures
- Never log sensitive data (passwords, tokens, PII); mask or omit these fields
- Add request tracing: use correlation IDs to track requests across services
- Frontend: Use browser DevTools console sparingly; prefer error reporting service (e.g., Sentry) in production

---

## 4. Performance & optimization

### Backend performance
- Use database query projection: select only required fields, not entire entities
- Enable JPA query logging at DEBUG level only; disable in production
- Leverage caching for frequently accessed, rarely changed data (Spring `@Cacheable` with TTL)
- Use virtual threads for I/O-intensive operations (e.g., API calls, database queries)
- Avoid N+1 query problems: use JPA `@EntityGraph` or explicit joins; verify with query logs
- Batch operations when processing large datasets; never iterate row-by-row for bulk updates
- Use DataFetcher patterns for GraphQL-like field resolution efficiency

### Frontend performance
- Code-split route components automatically with Next.js; use `dynamic()` for heavy components
- Lazy-load images with `next/image`; set appropriate width/height to avoid layout shift
- Minimize bundle size: audit with `next/bundle-analyzer`; remove unused dependencies monthly
- Use React Server Components to reduce JavaScript sent to the browser
- Memoize expensive computations with `useMemo`; memoize components with `React.memo` only if props are expensive to compare
- Implement pagination or infinite scroll for large lists; never render 1000+ items at once

### Database optimization
- Create database indexes on frequently queried columns (foreign keys, filters, sorts); verify with query plans
- Denormalize sparingly and only after profiling; measure the performance gain vs. consistency cost
- Archive old data periodically; never let tables grow indefinitely
- Monitor slow queries and add indexes reactively; set query timeout thresholds

---

## 5. API design & contracts

### RESTful conventions
- Use resource-based URLs: `/users`, `/courses/{id}/lessons`, not `/getUserById`, `/listCourses`
- Use standard HTTP methods correctly: GET (safe, idempotent), POST (creates), PUT (replace), PATCH (partial update), DELETE (remove)
- Use appropriate status codes: 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 409 (Conflict)
- Return JSON consistently; never mix XML or other formats
- Version API endpoints (e.g., `/api/v1/`, `/api/v2/`) if breaking changes are necessary
- Use pagination for list endpoints: `?page=1&limit=20` with metadata in response
- Use filtering, sorting, and searching via query parameters; keep URL lengths reasonable

### Request & response DTOs
- **Request DTOs**: Immutable `record` types; validate with `@Valid` and Spring bean validation annotations
- **Response DTOs**: Include only fields the client needs; never include internal IDs or system fields unless required
- Use snake_case in JSON (`firstName`, not `first_name`); configure Jackson with `@JsonProperty` if needed
- Include timestamps: `createdAt`, `updatedAt` in UTC ISO 8601 format
- Provide error responses with structure: `{ "error": { "code": "CODE", "message": "User-friendly message" } }`
- Document all fields in Javadoc comments; use `@Schema(description="...")` for API documentation (Springdoc-OpenAPI)

### pagination & filtering
- Provide default pagination (e.g., 20 items) and maximum limits to prevent performance issues
- Support filter operators: `eq`, `gt`, `lt`, `in` for common queries
- Return total count and `hasMore` flag for efficient pagination
- Support sorting by multiple fields: `?sort=name:asc,createdAt:desc`

---

## 6. Security & compliance

### General (OWASP Top 10)
- Validate and sanitise all user-supplied input server-side; never rely on client-side validation alone
- Use parameterised queries or JPA; never concatenate user input into SQL strings
- Set secure, `HttpOnly`, and `SameSite=Strict` flags on all authentication cookies
- Do not expose stack traces or internal error messages in API responses; return generic error messages to clients
- Keep dependencies up to date; flag any known CVEs in suggestions
- Use HTTPS/TLS for all communication; never transmit sensitive data over HTTP

### Authentication & authorization
- Use JWT (JJWT library) for API authentication; include user ID and roles in token claims
- Validate JWT signatures and expiry on every request; do not trust unverified claims
- Refresh tokens have longer TTL (~7 days); access tokens have shorter TTL (~15 min); rotate refresh tokens on use
- Enforce authentication at the **service layer**, not just controller/gateway level
- Apply role-based access control (RBAC): `@PreAuthorize("hasRole('ADMIN')")` on sensitive operations
- Never store sensitive data in JWT claims; only store immutable identifiers (user ID, roles)
- Implement lockout after N failed login attempts (e.g., 5 failures → lock for 15 minutes)

### Secrets & configuration
- Never hardcode secrets, API keys, passwords, JW tokens, or service URLs as string literals in code
- Use environment variables or a Secrets Manager (AWS Secrets Manager, HashiCorp Vault) for all secrets
- Ensure `.env`, `.env.local`, `.env.*.local`, and `application-local.properties` are in `.gitignore`
- Rotate credentials immediately if accidentally committed; treat as compromised
- Backend: Use Spring's `@Value` or `@ConfigurationProperties` to inject secrets safely
- Frontend: Store secrets in `.env.local` (never committed); `next.config.ts` loads env vars at build time

### PII & data privacy
- Never log personally identifiable information (email, phone, names, national IDs); mask in logs if necessary
- Do not include PII in exception messages or stack traces
- Minimise PII in API responses; return only what the client actually needs
- At-rest encryption: Use encrypted PostgreSQL connections; enable RDS encryption at rest
- GDPR/privacy compliance: Provide data export and deletion endpoints; maintain audit logs of data access
- Implement field-level encryption for highly sensitive data (e.g., SSN, passport numbers)

### Dependency security
- Do not introduce packages with known high-severity CVEs without justification
- Review dependencies monthly; run `mvn dependency-check` (Maven) and `npm audit` (Node)
- Flag packages with low activity, unverified publishers, or inactive maintainers
- Pin major versions in `pom.xml` and `package.json`; use `@` notation for npm: `"package": "^1.2.3"`

### API security
- Implement rate limiting: limit requests per IP/user (e.g., 100 requests per minute)
- Use CORS carefully: only allow trusted origins; never use `Access-Control-Allow-Origin: *` for sensitive endpoints
- Disable HTTP methods not needed: use `.csrf().csrfTokenRepository()` in Spring Security for CSRF protection
- Add security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Content-Security-Policy`
- Implement API key or OAuth 2.0 for service-to-service authentication if needed

---

## 7. Monitoring, logging & observability

### Structured logging
- Use SLF4J + Logback; include structured fields: `userId`, `requestId`, `serviceName`, `duration`
- Log at appropriate levels: DEBUG (development), INFO (business events), WARN (unexpected), ERROR (failures)
- Include request correlation IDs to trace requests across services; propagate via headers
- Never log sensitive data: passwords, tokens, PII; mask with `***` or exclude
- Example: `log.info("User login attempt", Map.of("userId", userId, "timestamp", Instant.now()))`

### Metrics & health checks
- Expose health endpoint: `/actuator/health` with custom health indicators
- Track key metrics: request latency, error rates, database connection pool, JVM heap usage, request count
- Use Micrometer for metrics; expose via Prometheus `/actuator/prometheus` endpoint
- Set up alerts: 5xx error rate >1%, response time p95 >500ms, memory usage >85%

### Distributed tracing
- Use correlation IDs (UUID) for all requests; include in response headers for debugging
- Propagate across services via HTTP headers: `X-Correlation-ID`
- Log correlation ID with every log entry for request tracing

---

## 8. Commit standards

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format
```
type(scope): subject

[optional body]

[optional footer]
```

### Types
| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that is not a fix or feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `chore` | Build, config, or tooling changes |
| `ci` | CI/CD pipeline changes |

### Rules
- Subject line: imperative mood, max 72 characters, no trailing period
- Body: explain *why*, not *what*; wrap at 72 characters; separate from subject with a blank line
- Footer: reference issues as `Closes #123` or `Refs #123`
- One logical change per commit; do not bundle unrelated changes
- Never commit commented-out code, debug logging, hardcoded test credentials, or `.env` files
- Run tests locally before committing; ensure linters pass (`eslint`, `checkstyle`)

### Examples
```
feat(auth): add JWT refresh token rotation

Refresh tokens now rotate on each use to reduce the window of exposure
for stolen tokens. The old token is invalidated immediately on reuse.

Closes #42
```

```
fix(api): return 404 instead of 500 when user not found

When a user is not found, return 404 instead of 500 to be more explicit.
Previously, the service returned a generic error which confused clients.
```

```
refactor(user-service): extract validation logic to UserValidator

Move reusable validation into a dedicated class to reduce duplication
across the UserService and AdminService.
```

---

## 9. Accessibility & user experience

### Frontend accessibility (WCAG 2.1 AA)
- All interactive elements must have proper ARIA labels: `<button aria-label="Close menu">`
- Use semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<button>` instead of `<div>` with onclick
- Test keyboard navigation: all features must work with Tab, Enter, Escape, Arrow keys
- Ensure sufficient color contrast: 4.5:1 for text, 3:1 for large text; test with accessibility checker
- Provide alt text for all images: `<img alt="Context-specific description" src="..." />`
- Use native form controls (`<input>`, `<select>`, `<textarea>`) unless a custom control is necessary
- Create error messages tied to form fields; use `aria-describedby` to associate error text
- Avoid auto-playing audio or video; provide controls and captions
- Test with screen readers (NVDA, JAWS, VoiceOver) regularly

### Responsive design
- Mobile-first approach: design for mobile, enhance for larger screens
- Test on real devices: iOS Safari, Android Chrome, tablets
- Use Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Ensure touch targets are at least 48x48px for mobile
- Avoid horizontal scrolling on mobile; use vertical stacking

### UX best practices
- Provide clear feedback: show loading states, success messages, error states with actionable guidance
- Keep forms short; use progressive disclosure for optional fields
- Avoid modals for critical information; use inline or page-level alternatives
- Provide undo/cancel for destructive actions (delete, clear); require confirmation with clear consequences
- Use consistent terminology across the product; define a style guide
- Test with real users; gather feedback before merging major UI changes

---

## 10. Documentation & knowledge sharing

### Code documentation
- Write Javadoc for all public methods in Java; include `@param`, `@return`, `@throws`
- Write JSDoc for all exported TypeScript functions and types
- Document non-obvious logic with concise comments; avoid stating the obvious
- Use README files in each service or feature directory: explain purpose, setup, common workflows
- Link to related docs: architectural decisions, API contracts, database schemas
- Update documentation when changing behavior; outdated docs are worse than no docs

### API documentation
- Use Springdoc-OpenAPI (`@Schema`, `@Operation`) to auto-generate OpenAPI specs
- Document all endpoints: path, method, request/response DTOs, status codes, error scenarios
- Include examples: sample requests and responses for typical use cases
- Version API docs alongside code; never let API docs drift from implementation
- Provide frontend example code: curl commands, JavaScript examples, SDK usage

### Architectural decisions
- Use ADRs (Architecture Decision Records) for major decisions: use template in `docs/adr/`
- Format: Context, Decision, Consequences, Alternatives considered
- Link ADRs from code (e.g., `/* See ADR-0001: JWT Token Strategy */`)
- Keep decisions up-to-date; mark deprecated or superseded decisions

### Onboarding
- Maintain a `CONTRIBUTING.md`: local setup, branch conventions, testing, deployment process
- Keep `README.md` in each service up-to-date: dependencies, port, config, common commands
- Create troubleshooting guides: common errors and solutions
- Document deployment procedures: how to deploy to dev, staging, production

---

## 11. Build & deployment

### Local development
- Use `docker-compose` for local services: PostgreSQL, Redis, message queues if needed
- Provide `Makefile` or `scripts/` directory with common commands: `make dev`, `make test`, `make build`
- Document prerequisites: JDK 25, Node 20+, Docker, Docker Compose versions
- Ensure tests pass locally before pushing: `mvn clean test`, `npm test`
- Use consistent naming for environment variables across services

### Build process
- **Backend**: Use Maven with enforcer plugin to check Java version, dependency convergence
- **Frontend**: Use Next.js build: `next build` verifies TypeScript, lints, builds production bundle
- Enable strict linting: fail builds on warnings; catch issues early
- Backend: Run `mvn dependency-check` monthly to scan for CVE vulnerabilities
- Frontend: Run `npm audit` and `npm outdated` regularly; update dependencies monthly
- Store build artifacts in a repository: Docker registry (ECR, Docker Hub), Maven Central (for libraries)

### Deployment
- Use Infrastructure-as-Code (IaC): Terraform, Cloudformation, or similar; version control infrastructure
- Containerize services: Dockerfile per service, build multi-stage images
- Deploy to staging before production; run smoke tests in each environment
- Use feature flags for gradual rollout; enable new features progressively, not all-at-once
- Maintain rollback procedures: keep previous versions available; test rollback process regularly
- Monitor deployment health: track error rates, latency, resource usage post-deploy
- Document runbooks: how to handle common issues in production (scaling, failover, hotfixes)

### Database deployments
- Always use Liquibase for schema changes; version control all migrations in `sllp-liquibase-service`
- Test migrations on staging before production
- Use blue-green deployments for zero-downtime database upgrades
- Back up database before major migrations; keep backups for 30+ days
- Document rollback steps for each migration; test rollback process
- Avoid long-running migrations during peak hours; schedule off-peak

### Environment management
- Maintain separate `application-{profile}.yaml` for dev, staging, production
- Use environment variables or Secrets Manager for secrets; never hardcode
- Ensure consistency: dev environment mirrors production as closely as possible
- Document required environment variables: `.env.example` (without values)
- Use deployment checklists: verify configuration before deploying

---

## 12. Microservices principles

### Service design
- Each service has a single business capability (e.g., user management, course content, evaluation)
- Keep services loosely coupled: communicate via REST/async, not shared databases
- Use consistent naming: `sllp-<service>` (e.g., `sllp-user-service`, `sllp-courses-service`)
- Each service has its own database; never share databases between services
- Document service responsibilities, boundaries, and dependencies in `README.md`

### Inter-service communication
- **Synchronous**: REST API calls through the API Gateway; no direct service-to-service calls (except service discovery)
- **Asynchronous**: Message queues (RabbitMQ, SQS) for events and background jobs; prefer event-driven
- Use correlation IDs across all requests; log them consistently
- Handle graceful degradation: if one service is down, others should continue functioning
- Implement circuit breaker patterns: fail fast, retry with backoff, fallback to cached data if available
- Document all service boundaries: what each service owns, what it provides to others

### Data consistency
- Avoid distributed transactions; use eventual consistency
- Maintain a changelog or event log per service for audit trails
- Use saga pattern for multi-step transactions across services
- Keep services autonomous: each service is responsible for its own data validation

---

## 13. Code organization best practices

### Backend package structure
```
com.nus.iss
├── controller/        # REST endpoints, request validation
├── service/          # Business logic, transactions
├── repository/       # JPA repositories, queries
├── entity/          # JPA entities (@Entity annotated)
├── dto/             # Data Transfer Objects (records or classes)
├── exception/       # Custom exceptions
├── config/          # Spring configurations, beans
├── util/            # Utility classes, constants
└── security/        # Authentication, authorization
```

### Frontend folder structure
```
app/
├── (auth)/          # Grouped auth routes
│   ├── login/
│   └── register/
├── (main)/          # Main app routes
│   ├── dashboard/
│   ├── courses/
│   └── vocabulary/
├── layout.tsx       # Root layout
└── error.tsx        # Root error boundary

components/
├── features/        # Feature-specific components
├── layout/          # Layout components (Navbar, Sidebar)
└── ui/              # Reusable UI components

lib/
├── api/             # API service layer
├── hooks/           # Custom React hooks
└── utils/           # Helper functions

types/               # TypeScript type definitions
```

### Naming conventions
- **Java classes**: PascalCase (`UserService`, `CreateUserRequest`)
- **Java methods/variables**: camelCase (`getUserById`, `maxRetries`)
- **Java constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **TypeScript types/interfaces**: PascalCase (`User`, `CourseDTO`)
- **TypeScript functions/variables**: camelCase (`fetchCourse`, `userId`)
- **React components**: PascalCase (`UserCard`, `CourseList`)
- **CSS classes**: kebab-case if custom; prefer Tailwind utilities
- **Database tables**: snake_case, plural (`users`, `course_enrollments`)
- **Database columns**: snake_case (`created_at`, `user_id`)

---

## 14. Version control practices

### Branching strategy (Git Flow simplified)
- `main` branch: production releases only; requires code review and passing CI/CD
- `develop` branch: integration branch for features; all features branch from here
- Feature branches: `feature/ISSUE-123-description` from `develop`; delete after merge
- Bugfix branches: `bugfix/ISSUE-456-description` from `develop`
- Hotfix branches: `hotfix/VERSION-PATCH` from `main`; merge to both `main` and `develop`
- Keep branches short-lived: merge within 1-2 weeks; avoid stale branches

### Code review standards
- Require at least 2 approvals before merging (1 frontend, 1 backend for full-stack changes)
- Use PR templates: include acceptance criteria, database changes, deployment notes
- Review for: correctness, security, performance, consistency, test coverage, documentation
- Use CI/CD to enforce: linting, testing, build success before manual review
- Approve only if you would merge confidently with your name on it
- Request changes for issues blocking merge; use "comment" for suggestions only
- Reviewers: give feedback within 24 hours; authors: address feedback within 48 hours

### Grand rules
- Do NOT force push to `main` or `develop`; use rebase locally only
- DO rebase feature branches before merging; keep history clean
- DO squash minor commits (fixup, formatting) before merge
- DO write meaningful PR descriptions and commit messages
- DO test the entire feature before marking as ready for review

