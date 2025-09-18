# CLAUDE.md - Frontend Development Guidelines

## Purpose & Scope

This document establishes rules and conventions for AI assistants and developers contributing to the **ProjectPlanning** frontend codebase. 

ProjectPlanning is a distributed application that enables NGOs to collaborate on international development projects, managing project creation, funding requests, resource commitments, and execution tracking. This frontend provides the user interface for all stakeholders in the platform.

**Tech Stack:**
- **Next.js** (App Router, TypeScript, Server Components by default)
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **lucide-react** for icons
- **pnpm** as package manager

## Golden Rules

### 1. Server-First Architecture
- **Default to Server Components** - Only add `"use client"` when you need browser APIs, event handlers, or React hooks
- Prefer server-side data fetching and processing when possible
- Use client components sparingly for interactive elements

### 2. File Structure Discipline
- Pages go in `src/app/` following Next.js App Router conventions
- Shared UI components in `src/components/`
- Utilities and helpers in `src/lib/`
- Never create components outside the designated folders

### 3. Accessibility First
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain proper color contrast ratios
- Test with screen readers when possible

### 4. Styling Conventions
- Use Tailwind CSS utility classes
- Follow shadcn/ui design patterns
- No custom CSS unless absolutely necessary
- No inline style hacks - use Tailwind's utility classes

### 5. Security & Environment
- Never hardcode API keys, URLs, or secrets
- Use `.env` files with `NEXT_PUBLIC_` prefix for client-exposed variables
- Validate environment variables at build time

## Project Structure

```
src/
├─ app/                    # Next.js App Router pages & layouts
│  ├─ (dashboard)/         # Route group for authenticated pages
│  ├─ projects/            # Project management pages
│  ├─ organizations/       # NGO management pages
│  ├─ commitments/         # Resource commitment pages
│  ├─ reports/            # Administrative reports
│  ├─ layout.tsx          # Root layout
│  └─ page.tsx            # Home page
├─ components/            # Reusable UI components
│  ├─ ui/                 # shadcn/ui primitives (Button, Input, etc.)
│  ├─ forms/              # Form components
│  ├─ layout/             # Navigation, headers, footers
│  └─ project/            # Project-specific components
├─ lib/                   # Utilities and helpers
│  ├─ auth.ts             # Authentication utilities
│  ├─ fetcher.ts          # API client functions
│  ├─ env.ts              # Environment validation
│  ├─ utils.ts            # General utilities
│  └─ validations.ts      # Zod schemas
├─ hooks/                 # Custom React hooks
│  ├─ use-auth.ts         # Authentication hook
│  └─ use-project.ts      # Project data hooks
├─ styles/                # Global styles
│  └─ globals.css         # Tailwind imports + global styles
└─ types/                 # TypeScript type definitions
   ├─ api.ts              # API response types
   └─ project.ts          # Project domain types
```

### Naming Conventions
- **Components**: PascalCase (`ProjectCard.tsx`, `UserProfile.tsx`)
- **Routes**: kebab-case (`/project-details`, `/user-settings`)
- **Utilities**: camelCase (`formatDate`, `validateEmail`)
- **Files**: kebab-case for non-components (`api-client.ts`, `form-schemas.ts`)

## Local Development

### Prerequisites
- Node.js >= 18.0.0
- pnpm (latest version)

### Commands
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm typecheck

# Run tests
pnpm test

# Preview production build
pnpm start
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_BONITA_API_URL=http://localhost:8080/bonita

# Feature Flags
NEXT_PUBLIC_ENABLE_REPORTS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=false

# Development Settings
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_VERSION=1.0.0

# Server-only variables (no NEXT_PUBLIC_ prefix)
JWT_SECRET=your-jwt-secret-here
DATABASE_URL=postgresql://user:pass@localhost:5432/projectplanning
```

### Environment Variable Rules
- **Client-exposed**: Use `NEXT_PUBLIC_` prefix (available in browser)
- **Server-only**: No prefix (only available in Node.js environment)
- Always validate environment variables in `lib/env.ts`

## shadcn/ui Guidelines

### Adding Components
```bash
# Add individual components
npx shadcn@latest add button input form card

# Add multiple components at once
npx shadcn@latest add button input form card table dialog
```

### Import Convention
```typescript
// ✅ Correct
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// ❌ Incorrect
import Button from "../ui/button"
```

### Using CVA for Variants
```typescript
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Routing, Layouts & Metadata

### File Conventions
- `page.tsx` - Route component
- `layout.tsx` - Shared layout for route segment
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 UI

### Layout Example
```typescript
// src/app/(dashboard)/layout.tsx
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### Route Groups
Use parentheses for organizational grouping without affecting URL structure:
- `(dashboard)` - Authenticated pages
- `(auth)` - Login/signup pages
- `(public)` - Marketing/landing pages

## Data Fetching & State Management

### Server-Side Fetching
```typescript
// src/app/projects/page.tsx
import { getProjects } from "@/lib/fetcher"

export default async function ProjectsPage() {
  // Server-side data fetching
  const projects = await getProjects()

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

### Client-Side State (when needed)
```typescript
// src/components/project-list.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { getProjects } from "@/lib/fetcher"

export function ProjectList() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  if (isLoading) return <ProjectsSkeleton />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {projects?.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

### Error Handling
```typescript
// src/app/projects/error.tsx
"use client"

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-lg font-semibold">Something went wrong!</h2>
      <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
        Try again
      </button>
    </div>
  )
}
```

## Forms

Use `react-hook-form` with `zod` validation and shadcn form components:

```typescript
// src/components/forms/project-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.number().positive("Budget must be positive"),
})

type ProjectFormData = z.infer<typeof projectSchema>

export function ProjectForm() {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      budget: 0,
    },
  })

  async function onSubmit(data: ProjectFormData) {
    try {
      await createProject(data)
      // Handle success
    } catch (error) {
      // Handle error
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Project description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </Form>
  )
}
```

## Code Style & Quality

### Prettier Configuration
```json
// .prettierrc
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### TypeScript Configuration
- Use strict mode
- Enable all strict type-checking options
- Prefer explicit types over `any`
- Use proper type imports: `import type { User } from "@/types"`

### Code Review Guidelines
- Keep PRs small and focused
- Write descriptive commit messages
- Document complex logic with comments
- Include tests for new features
- Update documentation when needed

## Integration Context

### Backend Integration

The frontend communicates with two main backend services:

1. **Bonita Open Solution Workflow Engine**
   - Orchestrates project lifecycle processes
   - Manages workflow states and transitions
   - Handles business process automation

2. **REST API with JWT Authentication**
   - Manages projects, stages, and commitments
   - Handles user authentication and authorization
   - Provides data persistence and business logic

### API Client Requirements

**All API calls must use the centralized fetcher in `lib/fetcher.ts`:**

```typescript
// lib/fetcher.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

// Example usage functions
export const getProjects = () => apiRequest<Project[]>('/projects')
export const createProject = (data: CreateProjectData) => 
  apiRequest<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })
```

### Authentication Flow
- JWT tokens stored securely (httpOnly cookies preferred)
- Token refresh handled automatically
- Protected routes redirect to login when unauthorized
- Role-based access control for different user types

### Data Flow
1. User interactions trigger form submissions or navigation
2. Frontend validates input using Zod schemas
3. API calls made through centralized fetcher with JWT auth
4. Bonita workflows triggered for business processes
5. UI updates based on API responses
6. Real-time updates via WebSocket connections (if implemented)

---

## Quick Reference

### Common Commands
```bash
# Add new shadcn component
npx shadcn@latest add [component-name]

# Generate new page
mkdir src/app/new-page && touch src/app/new-page/page.tsx

# Run type checking
pnpm typecheck

# Format code
pnpm prettier --write .
```

### File Templates
- Components: Use Server Components by default
- Pages: Include proper metadata and error boundaries  
- API calls: Always use `lib/fetcher.ts`
- Forms: Use react-hook-form + zod + shadcn components

Remember: **Server-first, accessible, type-safe, and maintainable code is our standard.**