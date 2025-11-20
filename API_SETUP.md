# Centralized API & Query Setup

This project uses a centralized API client with React Query for data fetching and mutations.

## Architecture

```
src/
├── lib/
│   ├── api-client.ts          # Axios instance with interceptors
│   └── query-client.ts         # Server-side query client
├── hooks/
│   └── use-queries.ts          # All React Query hooks (generic + specific)
└── providers/
    └── react-query-provider.tsx # React Query provider
```

## Files Overview

### 1. **api-client.ts** - Centralized Axios Configuration

- Single axios instance with base URL configuration
- Request interceptors (add auth token)
- Response interceptors (handle errors, redirect on 401)
- Centralized error handling

### 2. **use-queries.ts** - All React Query Hooks

- Generic hooks (`useFetch`, `usePostMutation`, `useUpdateMutation`, `useDeleteMutation`)
- Specific hooks (examples: `useProjects`, `useProject`, `useCreateProject`, etc.)

### 3. **react-query-provider.tsx** - React Query Setup

- QueryClient configuration
- Provider wrapper for the entire app

## Usage Examples

### Fetch Data

```tsx
"use client";

import { useProjects } from "@/hooks/use-queries";

export function ProjectsList() {
  const { data, isLoading, error } = useProjects();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.map((project) => (
        <li key={project.id}>{project.title}</li>
      ))}
    </ul>
  );
}
```

### Create Data

```tsx
"use client";

import { useCreateProject } from "@/hooks/use-queries";
import { useQueryClient } from "@tanstack/react-query";

export function CreateProjectForm() {
  const queryClient = useQueryClient();
  const { mutate: createProject } = useCreateProject({
    onSuccess: () => {
      // Refetch projects after creation
      queryClient.invalidateQueries({ queryKey: ["/projects"] });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createProject({ title: "New Project" });
      }}
    >
      {/* form fields */}
    </form>
  );
}
```

### Update Data

```tsx
"use client";

import { useUpdateProject } from "@/hooks/use-queries";

export function EditProject({ id }: { id: string }) {
  const { mutate: updateProject } = useUpdateProject(id, {
    onSuccess: () => {
      console.log("Project updated!");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateProject({ title: "Updated Title" });
      }}
    >
      {/* form fields */}
    </form>
  );
}
```

### Delete Data

```tsx
"use client";

import { useDeleteProject } from "@/hooks/use-queries";

export function DeleteProjectButton({ id }: { id: string }) {
  const { mutate: deleteProject } = useDeleteProject(id);

  return <button onClick={() => deleteProject()}>Delete Project</button>;
}
```

### Generic Hook for Custom Endpoint

```tsx
"use client";

import { useFetch, usePostMutation } from "@/hooks/use-queries";

// Fetch from any endpoint
const { data } = useFetch("/custom-endpoint");

// Post to any endpoint
const { mutate } = usePostMutation("/custom-endpoint");
```

## Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Features

✅ Centralized axios instance
✅ Automatic auth token injection
✅ Global error handling
✅ Generic and specific hooks
✅ TypeScript support
✅ React Query caching
✅ Optimistic updates support
✅ Refetch on invalidation

## Adding New Hooks

Add specific hooks to `use-queries.ts`:

```tsx
export function useMyCustomHook(options?: UseQueryOptions<any>) {
  return useFetch<any>("/my-endpoint", options);
}
```

Or use generic hooks directly in components:

```tsx
const { data } = useFetch("/any-endpoint");
```
