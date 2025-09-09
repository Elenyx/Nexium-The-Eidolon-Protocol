# Overview

Nexium is an anime-themed Discord RPG bot web application that allows users to collect characters, engage in battles, participate in guild wars, and more. The application features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence through Drizzle ORM. Users authenticate via Discord OAuth and can manage their character collections, view battle histories, participate in leaderboards, and engage with the community.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side navigation
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation
- **Design Patterns**: Component composition, custom hooks for reusable logic

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints following resource-based routing
- **Middleware**: Express middleware for request logging, JSON parsing, and error handling
- **File Structure**: Modular separation with dedicated route handlers and storage abstraction layer

## Data Storage Solutions
- **Database**: PostgreSQL using Neon serverless database
- **ORM**: Drizzle ORM with schema-first approach
- **Migration Strategy**: Drizzle Kit for database migrations and schema management
- **Connection Management**: Connection pooling via @neondatabase/serverless
- **Schema Design**: Relational design with foreign key relationships between users, characters, battles, guilds, and forum entities

## Authentication and Authorization
- **Provider**: Discord OAuth 2.0 integration
- **Session Management**: Client-side storage with localStorage persistence
- **User Flow**: OAuth callback handling with URL parameter parsing and cleanup
- **Security**: Environment-based configuration for OAuth credentials

## External Dependencies
- **Database Hosting**: Neon serverless PostgreSQL
- **Authentication**: Discord OAuth API
- **UI Components**: Radix UI primitives (@radix-ui/react-*)
- **Validation**: Zod schema validation library
- **Date Handling**: date-fns for date utilities
- **Development Tools**: Vite with hot module replacement, Replit-specific development plugins
- **Font Loading**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)