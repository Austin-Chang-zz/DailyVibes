# Overview

This is a mood tracking web application built with React and Express. The application allows users to log their daily moods with emojis and optional notes, providing a simple interface for emotional self-monitoring. Users can select from predefined mood options (happy, sad, excited, calm, etc.) and view their mood history over time.

# Core Directory Tree

```
DailyVibes/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── ui/            # shadcn/ui component library
│   │   │   ├── ai-insights.tsx       # AI mood pattern analysis
│   │   │   ├── ai-recommendations.tsx # AI wellness suggestions
│   │   │   ├── theme-provider.tsx    # Dark/light mode context
│   │   │   └── theme-toggle.tsx      # Theme switch component
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   │   ├── queryClient.ts # TanStack Query configuration
│   │   │   └── utils.ts       # Helper functions
│   │   ├── pages/             # Application pages/routes
│   │   │   ├── mood-tracker.tsx      # Main mood logging interface
│   │   │   └── not-found.tsx         # 404 error page
│   │   ├── App.tsx            # Root application component
│   │   ├── index.css          # Global styles and Tailwind
│   │   └── main.tsx           # React app entry point
│   └── index.html             # HTML template
├── server/                     # Backend Express.js API
│   ├── ai-service.ts          # DeepSeek API integration
│   ├── index.ts               # Express server setup
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # Data persistence layer
│   └── vite.ts                # Development server integration
├── shared/                     # Shared TypeScript types
│   └── schema.ts              # Zod validation schemas
├── examples/                   # Usage examples
│   └── deepseek-coding-assistant.js  # DeepSeek API demo
├── package.json               # Node.js dependencies
├── vite.config.ts             # Vite build configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── replit.md                  # Project documentation
```

# User Preferences

Preferred communication style: Simple, everyday language.  
✓ Add a placeholder to let user can entry his/her name (completed)
✓ Add dark mode support (completed)

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with JSON responses
- **Storage**: Currently using in-memory storage (MemStorage class) with interface for easy database integration
- **Validation**: Zod schemas shared between client and server
- **Development**: Hot module replacement with Vite integration for seamless development experience

## Data Storage
- **Current**: In-memory storage using Map data structure
- **Planned**: PostgreSQL with Drizzle ORM (configuration already set up)
- **Schema**: Single mood_entries table with id, mood, emoji, note, and createdAt fields
- **Database Driver**: @neondatabase/serverless for PostgreSQL connectivity

## Authentication & Authorization
- No authentication system currently implemented
- Session handling infrastructure present (connect-pg-simple) for future implementation

## Development Features
- **Type Safety**: Full TypeScript implementation with shared types between client and server
- **Hot Reloading**: Vite development server with Express integration
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Error Handling**: Runtime error overlay for development debugging
- **Code Quality**: Structured component architecture with reusable UI components

## Build & Deployment
- **Build Process**: Vite for frontend bundling, esbuild for server compilation
- **Production**: Single build command creates both client and server bundles
- **Asset Handling**: Static file serving with proper cache headers
- **Environment**: Environment-based configuration for development and production

# External Dependencies

## Database & ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **@neondatabase/serverless**: PostgreSQL driver optimized for serverless environments
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI & Styling
- **Radix UI**: Comprehensive component primitives for accessibility and interaction
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe variant API for component styling

## State Management & Data Fetching
- **TanStack Query**: Powerful data synchronization for React applications
- **React Hook Form**: Performant forms with easy validation integration
- **Zod**: TypeScript-first schema validation library

## Development Tools
- **Vite**: Next-generation frontend build tool with HMR
- **TypeScript**: Static type checking for enhanced developer experience
- **PostCSS**: CSS processing with autoprefixer for browser compatibility
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development environment enhancements

## Utilities
- **date-fns**: Modern JavaScript date utility library
- **nanoid**: URL-safe unique ID generator
- **clsx & tailwind-merge**: Conditional className utilities for dynamic styling