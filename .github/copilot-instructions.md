
# Copilot Coding Agent Onboarding Instructions

## High Level Repository Overview

### Summary
This repository, "Nexium-The-Eidolon-Protocol," is a multi-component project for a Discord RPG bot and a web dashboard. It includes a TypeScript/Node.js backend for Discord bot logic, a web frontend (React + Vite), and a database layer. The project is designed for game logic, user management, and web-based visualization of game data.

### Repository Type, Size, and Technologies
- **Type:** Monorepo with bot (Node.js/TypeScript), web (React/TypeScript), and shared code.
- **Languages:** TypeScript (primary), JavaScript, SQL.
- **Frameworks/Libraries:**
  - Backend: Node.js, Discord.js, Drizzle ORM
  - Frontend: React, Vite, TailwindCSS
  - Testing: Jest (for bot), Vitest (for web)
- **Target Runtimes:** Node.js (v18+ recommended), modern browsers for web frontend.
- **Size:** Medium (hundreds of files, multiple subprojects)

## Build, Test, and Validation Instructions

### General
- **Always run `npm install` in each subproject (`bot/`, `web/`) after pulling new code or changing dependencies.**
- **Node.js v18+ is required.**
- **If you encounter build or runtime errors, ensure all dependencies are installed and the correct Node version is used.**

### Bot (Discord Bot)
- **Install dependencies:**
  - `cd bot && npm install`
- **Build:**
  - `npm run build` (runs TypeScript build, outputs to `bot/build.js`)
- **Test:**
  - `npm test` (runs Jest tests; see `bot/run-tests.js`)
- **Run:**
  - `npm start` (if defined in `bot/package.json`)
  - Or: `node build.js`
- **Lint:**
  - `npm run lint` (if defined)
- **Database:**
  - Migrations and seed scripts are in `src/database/`. Use `ts-node` to run scripts like `seed.ts` or `wipe_and_rebuild.ts`.
  - Example: `npx ts-node src/database/seed.ts`
- **Preconditions:**
  - Ensure `.env` is present and configured for Discord and database credentials.
  - If missing, copy from `.env.example` or ask the maintainer.

### Web (Frontend)
- **Install dependencies:**
  - `cd web && npm install`
- **Build:**
  - `npm run build` (Vite build, outputs to `web/dist/`)
- **Test:**
  - `npm test` or `npm run test` (runs Vitest)
- **Run (development):**
  - `npm run dev` (starts Vite dev server)
- **Lint:**
  - `npm run lint` (if defined)
- **Preconditions:**
  - Ensure `.env` is present for web config (API endpoints, etc.).

### Shared
- Shared code is in `web/shared/` and imported by both bot and web projects.

### Cleaning and Troubleshooting
- If builds fail, try cleaning `node_modules` and `dist`/`build` folders:
  - `rm -rf node_modules dist build` (use `rmdir /s /q node_modules` on Windows)
  - Then rerun `npm install`.
- If TypeScript errors persist, try `npx tsc --build --clean` then rebuild.
- If database scripts fail, check your database connection and credentials.

### Validation
- Run all tests before submitting changes: `npm test` in both `bot/` and `web/`.
- Check for lint errors: `npm run lint`.
- Ensure the bot starts and the web dashboard loads locally.
- If CI/CD is configured, ensure all checks pass before merging.

## Project Layout and Architecture

- **Root files:** `package.json`, `ENVIRONMENT_SETUP.md`, `README.md` (if present)
- **Bot:** `bot/` (Discord bot source, tests, build scripts, config)
- **Web:** `web/` (React app, Vite config, Tailwind config, shared code)
- **Database:** `src/database/` (SQL schema, seed scripts, migration scripts)
- **Shared:** `web/shared/` (TypeScript types and utilities shared between bot and web)
- **Tests:** `bot/test/`, `web/client/pages/*.test.tsx`, etc.
- **Config files:**
  - TypeScript: `tsconfig.json` in each subproject
  - Vite: `web/vite.config.ts`
  - Tailwind: `web/tailwind.config.ts`
  - Drizzle ORM: `web/drizzle.config.ts`
  - Linting: `.eslintrc`, `.prettierrc` (if present)

## CI/CD and Validation Pipelines
- If `.github/workflows/` exists, check for GitHub Actions workflows for build/test/lint.
- Always ensure local tests and builds pass before pushing.

## Additional Notes
- **Trust these instructions. Only perform additional searching if information is missing or found to be incorrect.**
- **If you encounter a missing or failing step, document the error and the workaround.**
- **Environment setup is critical: always check for required `.env` files and correct Node.js version.**
- **For new dependencies, always run `npm install` in the relevant subproject.**

## Root Directory File List
- `ENVIRONMENT_SETUP.md`
- `package.json`
- `bot/` (Discord bot)
- `web/` (Web frontend)
- `src/` (shared and database code)

## Directory Structure (Key Folders)
- `bot/src/commands/` — Discord bot commands
- `bot/src/database/` — Database scripts and schema
- `web/client/pages/` — React pages
- `web/shared/` — Shared TypeScript types/utilities

---

## Project Coding Standards for TypeScript and React

### Applies to: `**/*.ts, **/*.tsx`

Apply the general coding guidelines to all code.

#### TypeScript Guidelines
- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators

#### React Guidelines
- Use functional components with hooks
- Follow the React hooks rules (no conditional hooks)
- Use React.FC type for components with children
- Keep components small and focused
- Use CSS modules for component styling

---

## Project Documentation Writing Guidelines

### Applies to: `docs/**/*.md`

#### General Guidelines
- Write clear and concise documentation.
- Use consistent terminology and style.
- Include code examples where applicable.

#### Grammar
- Use present tense verbs (is, open) instead of past tense (was, opened).
- Write factual statements and direct commands. Avoid hypotheticals like "could" or "would".
- Use active voice where the subject performs the action.
- Write in second person (you) to speak directly to readers.

#### Markdown Guidelines
- Use headings to organize content.
- Use bullet points for lists.
- Include links to related resources.
- Use code blocks for code snippets.

---

## Copilot Edits Operational Guidelines

### PRIME DIRECTIVE

- Avoid working on more than one file at a time.
- Multiple simultaneous edits to a file will cause corruption.
- Be chatting and teach about what you are doing while coding.

### LARGE FILE & COMPLEX CHANGE PROTOCOL

#### MANDATORY PLANNING PHASE

When working with large files (>300 lines) or complex changes:

1. ALWAYS start by creating a detailed plan BEFORE making any edits
2. Your plan MUST include:
   - All functions/sections that need modification
   - The order in which changes should be applied
   - Dependencies between changes
   - Estimated number of separate edits required
3. Format your plan as:

#### PROPOSED EDIT PLAN

Working with: [filename]
Total planned edits: [number]

#### MAKING EDITS

- Focus on one conceptual change at a time
- Show clear "before" and "after" snippets when proposing changes
- Include concise explanations of what changed and why
- Always check if the edit maintains the project's coding style

#### Edit sequence

1. [First specific change] - Purpose: [why]
2. [Second specific change] - Purpose: [why]
3. Do you approve this plan? I'll proceed with Edit [number] after your confirmation.
4. WAIT for explicit user confirmation before making ANY edits when user ok edit [number]

#### EXECUTION PHASE

- After each individual edit, clearly indicate progress:
  "✅ Completed edit [#] of [total]. Ready for next edit?"
- If you discover additional needed changes during editing:
  - STOP and update the plan
  - Get approval before continuing

#### REFACTORING GUIDANCE

When refactoring large files:

- Break work into logical, independently functional chunks
- Ensure each intermediate state maintains functionality
- Consider temporary duplication as a valid interim step
- Always indicate the refactoring pattern being applied

#### RATE LIMIT AVOIDANCE

- For very large files, suggest splitting changes across multiple sessions
- Prioritize changes that are logically complete units
- Always provide clear stopping points

### General Requirements

Use modern technologies as described below for all code suggestions. Prioritize clean, maintainable code with appropriate comments.

#### Accessibility

- Ensure compliance with **WCAG 2.1** AA level minimum, AAA whenever feasible.
- Always suggest:
  - Labels for form fields.
  - Proper **ARIA** roles and attributes.
  - Adequate color contrast.
  - Alternative texts (`alt`, `aria-label`) for media elements.
  - Semantic HTML for clear structure.
  - Tools like **Lighthouse** for audits.

### Browser Compatibility

- Prioritize feature detection (`if ('fetch' in window)` etc.).
- Support latest two stable releases of major browsers:
  - Firefox, Chrome, Edge, Safari (macOS/iOS)
- Emphasize progressive enhancement with polyfills or bundlers (e.g., **Babel**, **Vite**) as needed.

### PHP Requirements

- **Target Version**: PHP 8.1 or higher
- **Features to Use**:
  - Named arguments
  - Constructor property promotion
  - Union types and nullable types
  - Match expressions
  - Nullsafe operator (`?->`)
  - Attributes instead of annotations
  - Typed properties with appropriate type declarations
  - Return type declarations
  - Enumerations (`enum`)
  - Readonly properties
  - Emphasize strict property typing in all generated code.
- **Coding Standards**:
  - Follow PSR-12 coding standards
  - Use strict typing with `declare(strict_types=1);`
  - Prefer composition over inheritance
  - Use dependency injection
- **Static Analysis:**
  - Include PHPDoc blocks compatible with PHPStan or Psalm for static analysis
- **Error Handling:**
  - Use exceptions consistently for error handling and avoid suppressing errors.
  - Provide meaningful, clear exception messages and proper exception types.

### HTML/CSS Requirements

- **HTML**:
  - Use HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<search>`, etc.)
  - Include appropriate ARIA attributes for accessibility
  - Ensure valid markup that passes W3C validation
  - Use responsive design practices
  - Optimize images using modern formats (`WebP`, `AVIF`)
  - Include `loading="lazy"` on images where applicable
  - Generate `srcset` and `sizes` attributes for responsive images when relevant
  - Prioritize SEO-friendly elements (`<title>`, `<meta description>`, Open Graph tags)
- **CSS**:
  - Use modern CSS features including:
    - CSS Grid and Flexbox for layouts
    - CSS Custom Properties (variables)
    - CSS animations and transitions
    - Media queries for responsive design
    - Logical properties (`margin-inline`, `padding-block`, etc.)
    - Modern selectors (`:is()`, `:where()`, `:has()`)
    - Follow BEM or similar methodology for class naming
    - Use CSS nesting where appropriate
    - Include dark mode support with `prefers-color-scheme`
    - Prioritize modern, performant fonts and variable fonts for smaller file sizes
    - Use modern units (`rem`, `vh`, `vw`) instead of traditional pixels (`px`) for better responsiveness

### JavaScript Requirements

- **Minimum Compatibility**: ECMAScript 2020 (ES11) or higher
- **Features to Use**:
  - Arrow functions
  - Template literals
  - Destructuring assignment
  - Spread/rest operators
  - Async/await for asynchronous code
  - Classes with proper inheritance when OOP is needed
  - Object shorthand notation
  - Optional chaining (`?.`)
  - Nullish coalescing (`??`)
  - Dynamic imports
  - BigInt for large integers
  - `Promise.allSettled()`
  - `String.prototype.matchAll()`
  - `globalThis` object
  - Private class fields and methods
  - Export * as namespace syntax
  - Array methods (`map`, `filter`, `reduce`, `flatMap`, etc.)
- **Avoid**:
  - `var` keyword (use `const` and `let`)
  - jQuery or any external libraries
  - Callback-based asynchronous patterns when promises can be used
  - Internet Explorer compatibility
  - Legacy module formats (use ES modules)
  - Limit use of `eval()` due to security risks
- **Performance Considerations:**
  - Recommend code splitting and dynamic imports for lazy loading
- **Error Handling**:
  - Use `try-catch` blocks **consistently** for asynchronous and API calls, and handle promise rejections explicitly.
  - Differentiate among:
    - **Network errors** (e.g., timeouts, server errors, rate-limiting)
    - **Functional/business logic errors** (logical missteps, invalid user input, validation failures)
    - **Runtime exceptions** (unexpected errors such as null references)
  - Provide **user-friendly** error messages (e.g., “Something went wrong. Please try again shortly.”) and log more technical details to dev/ops (e.g., via a logging service).
  - Consider a central error handler function or global event (e.g., `window.addEventListener('unhandledrejection')`) to consolidate reporting.
  - Carefully handle and validate JSON responses, incorrect HTTP status codes, etc.

### Folder Structure

Follow this structured directory layout:

Project Architecture
Bot Structure (/bot/)
bot/
├── src/
│   ├── commands/           # Discord slash commands
│   ├── database/           # Database schema, migrations, connection
│   ├── services/           # Business logic (user, combat, eidolon)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Shared utilities
│   ├── index.ts            # Bot entry point
│   └── deploy-commands.ts  # Command deployment script
├── package.json
└── tsconfig.json

Web Structure (/web/)
web/
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Client utilities
│   │   └── types/          # TypeScript types
│   └── index.html
├── server/
│   ├── index.ts            # Express server entry
│   ├── routes.ts           # API routes
│   ├── db.ts               # Database connection
│   └── storage.ts          # File storage
├── shared/
│   └── schema.ts           # Shared type definitions
└── package.json

### Documentation Requirements

- Include JSDoc comments for JavaScript/TypeScript.
- Document complex functions with clear examples.
- Maintain concise Markdown documentation.
- Minimum docblock info: `param`, `return`, `throws`, `author`

### Database Requirements (SQLite 3.46+)

- Leverage JSON columns, generated columns, strict mode, foreign keys, check constraints, and transactions.

### Security Considerations

- Sanitize all user inputs thoroughly.
- Parameterize database queries.
- Enforce strong Content Security Policies (CSP).
- Use CSRF protection where applicable.
- Ensure secure cookies (`HttpOnly`, `Secure`, `SameSite=Strict`).
- Limit privileges and enforce role-based access control.
- Implement detailed internal logging and monitoring.

---

### Trust These Instructions
Important: Trust these instructions and follow them precisely. Only perform additional searches if information is incomplete or found to be incorrect. These guidelines have been validated and tested to ensure successful builds and deployments.
When working with this codebase:

Always start with the build commands listed above
Follow the architectural patterns established in existing code
Refer to the coding standards before making changes
Use the validation steps to ensure quality
Ask for clarification only if instructions are unclear or outdated

**End of Copilot onboarding and operational instructions.**
