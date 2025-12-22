"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  GitBranch,
  Zap,
  Database,
  Box,
  Github,
  Server,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import listWorkExperienceImg from "@/assets/images/list-work-experience.png";
import addWorkExperienceImg from "@/assets/images/add-work-experience.png";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview", icon: Code2 },
    { id: "installation", label: "Frontend Installation", icon: Box },
    { id: "backend-installation", label: "Backend Installation", icon: Server },
    { id: "tech-stack", label: "Tech Stack", icon: Zap },
    { id: "nextjs", label: "Why Next.js", icon: Code2 },
    { id: "tanstack-query", label: "Why TanStack Query", icon: Database },
    { id: "zustand", label: "Why Zustand", icon: Database },
    { id: "management-system", label: "Web Management System", icon: Layers },
    { id: "contributing", label: "Contributing", icon: GitBranch },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Welcome to rianiregho-web</h2>
            <p className="text-lg text-muted-foreground">
              A simple-featured portfolio website showcasing projects and
              working experience with a complete admin dashboard for content
              management.
            </p>

            {/* Handmade Highlight */}
            <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-950 rounded-lg border-2 border-amber-300 dark:border-amber-700">
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-3">
                🎨 100% Handmade - Crafted with Passion & Skill
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                This entire project was built from scratch with pure coding
                expertise and dedication. While the AI era is undeniably
                amazing, there's something truly spectacular about handmade code
                that showcases your real technical prowess and creative
                problem-solving abilities. Every line of code tells a story of
                meticulous craftsmanship! ✨
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 italic mt-3">
                <strong>P.S.</strong> Only for this documentation I made with
                AI, coz I'm a bit lazy hahaha 😄
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Frontend Framework
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Built with Next.js 16+ using the App Router for modern,
                    server-optimized React applications.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    State Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Lightweight state management with Zustand and powerful data
                    fetching with TanStack Query.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="font-bold mb-2">Key Features:</h3>
              <ul className="space-y-2 text-sm">
                <li>✨ Modern portfolio showcase</li>
                <li>📊 Admin dashboard with CRUD operations</li>
                <li>🔐 GitHub OAuth authentication</li>
                <li>🎨 Dark/Light theme support</li>
                <li>📱 Fully responsive design</li>
                <li>⚡ Server-side rendering with Next.js</li>
                <li>🖼️ Image upload and gallery management</li>
              </ul>
            </div>
          </div>
        );

      case "installation":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Installation & Setup</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">
                  1. Clone the Repository
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
                    git clone https://github.com/rrrgho/rianiregho-web.git
                    <br />
                    cd rianiregho-web
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  2. Install Dependencies
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">npm install</code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  3. Environment Variables
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Create a{" "}
                  <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                    .env.local
                  </code>{" "}
                  file in the root directory:
                </p>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm whitespace-pre-wrap">{`NEXT_PUBLIC_STORAGE_URL=your_storage_url
NEXT_PUBLIC_API_URL=your_api_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret`}</code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  4. Run Development Server
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">npm run dev</code>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Open{" "}
                  <a
                    href="http://localhost:3000"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    http://localhost:3000
                  </a>{" "}
                  in your browser.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  5. Build for Production
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
                    npm run build && npm run start
                  </code>
                </div>
              </div>
            </div>
          </div>
        );

      case "backend-installation":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              Backend Installation (Laravel API)
            </h2>
            <p className="text-muted-foreground">
              Follow these steps to set up the Laravel backend API with
              PostgreSQL.
            </p>

            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Why Laravel?</strong> The API was already established
                from the previous website version. We are actively migrating to
                a Next.js API, but the transition is still in development. For
                now, the Laravel API continues to power the backend while we
                work on the migration.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">
                  1. Clone the Repository
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
                    git clone https://github.com/rrrgho/rianiregho-web-api.git
                    <br />
                    cd rianiregho-web-api
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  2. Install PHP Dependencies
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">composer install</code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  3. Copy Environment File
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">cp .env.example .env</code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  4. Environment Variables
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Update your{" "}
                  <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                    .env
                  </code>{" "}
                  file with the following:
                </p>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm whitespace-pre-wrap">{`APP_NAME="rianiregho-web-api"
APP_ENV=local
APP_DEBUG=true
APP_KEY=

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=rianiregho_web
DB_USERNAME=postgres
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

SESSION_DOMAIN=localhost
SESSION_SAME_SITE=lax`}</code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  5. Generate Application Key
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">php artisan key:generate</code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  6. Run Database Migrations
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">php artisan migrate</code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  7. Start Development Server
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">php artisan serve</code>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  The API will be running at{" "}
                  <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                    http://localhost:8000
                  </code>
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> Make sure PostgreSQL is installed and
                  running. Adjust the environment variables according to your
                  local setup, especially DB_HOST, DB_PASSWORD, and other
                  database credentials.
                </p>
              </div>
            </div>
          </div>
        );

      case "tech-stack":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Technology Stack</h2>
            <p className="text-muted-foreground">
              This project leverages modern web technologies to deliver a fast,
              scalable, and maintainable application.
            </p>

            <div className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frontend Framework</CardTitle>
                  <CardDescription>Next.js 16+</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Modern React framework with Server-Side Rendering (SSR),
                    Static Site Generation (SSG), and API routes. Provides
                    optimal performance and SEO.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Styling</CardTitle>
                  <CardDescription>Tailwind CSS v4 + shadcn/ui</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Utility-first CSS framework combined with beautiful,
                    accessible React components built on Radix UI primitives.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Fetching & Caching</CardTitle>
                  <CardDescription>
                    React Query (TanStack Query)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Powerful server-state management with automatic caching,
                    refetching, and synchronization. Reduces boilerplate and
                    improves UX significantly.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>State Management</CardTitle>
                  <CardDescription>Zustand</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Lightweight, flexible state management library for
                    client-side state. Perfect for managing UI state, themes,
                    and user preferences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Form Management</CardTitle>
                  <CardDescription>React Hook Form + Zod</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Efficient form handling with minimal re-renders, combined
                    with TypeScript-first schema validation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>NextAuth.js</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Secure authentication with GitHub OAuth, session management,
                    and built-in middleware support.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>HTTP Client</CardTitle>
                  <CardDescription>Axios</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Promise-based HTTP client with request/response interceptors
                    for handling tokens, errors, and API communication.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "nextjs":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Why Next.js?</h2>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ⚡ Server-Side Rendering (SSR)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Improved SEO and initial page load performance. Content is
                    rendered on the server before being sent to the browser.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📦 Built-in Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Automatic image optimization, code splitting, and
                    performance monitoring out of the box.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔗 API Routes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Build backend functionality without needing a separate
                    server. Perfect for middleware and API aggregation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎯 App Router
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Modern routing with layouts, nested routes, and file-based
                    routing convention for cleaner code organization.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "tanstack-query":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              Why TanStack Query (React Query)?
            </h2>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    💾 Automatic Caching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Intelligently cache server data and reduce unnecessary API
                    calls. Stale data is automatically refreshed in the
                    background.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔄 Smart Refetching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Automatic refetching on window focus, reconnection, or
                    interval. Keep your data always fresh without manual
                    management.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ⚙️ Built-in Loading States
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Handles loading, error, and success states automatically. No
                    more boilerplate for state management.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎯 Mutations & Optimistic Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Efficiently handle POST, PUT, DELETE requests. Optimistic
                    updates provide instant UI feedback while waiting for server
                    response.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🚀 Better Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reduces unnecessary re-renders and API calls. Significantly
                    improves application performance and user experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "zustand":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Why Zustand?</h2>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎈 Lightweight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Minimal bundle size (~2KB). No complex setup or boilerplate
                    required, unlike Redux.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎯 Simple API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Easy to understand and implement. Perfect for managing
                    theme, user UI preferences, and application state.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ⚡ Minimal Re-renders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Only components that subscribe to changed state re-render.
                    No unnecessary performance overhead.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔗 DevTools Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Built-in DevTools integration for debugging and time-travel
                    debugging capabilities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📱 Flexible Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Works great with TypeScript, middleware support, and can be
                    used outside React components if needed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "management-system":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Web Management System</h2>
            <p className="text-muted-foreground">
              Learn how to use the admin dashboard to manage your working
              experience and projects.
            </p>

            <div className="space-y-8 mt-6">
              {/* Working Experience Management */}
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Managing Working Experience
                </h3>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        The working experience management section allows you to
                        add, edit, and delete your professional experiences.
                        Each entry includes company details, job description,
                        employment dates, and media assets like company logo and
                        banner images.
                      </p>
                    </CardContent>
                  </Card>

                  <div>
                    <h4 className="font-bold text-lg mb-3">
                      1. Working Experience List
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      View all your working experiences in a table format with
                      quick actions:
                    </p>
                    <div className="relative w-full h-96 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
                      <Image
                        src={listWorkExperienceImg}
                        alt="Working Experience List"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      The list view shows all your working experiences with edit
                      and delete options
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-3">
                      2. Adding New Working Experience
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Fill in the following details to create a new working
                      experience entry:
                    </p>
                    <div className="relative w-full h-96 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
                      <Image
                        src={addWorkExperienceImg}
                        alt="Add Working Experience"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      The form for adding new working experience entries
                    </p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Form Fields</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm">
                        <li>
                          <strong>Icon:</strong> Company logo image
                        </li>
                        <li>
                          <strong>Banner:</strong> Background image for the
                          working experience showcase
                        </li>
                        <li>
                          <strong>Company Logo:</strong> Additional company logo
                          for branding
                        </li>
                        <li>
                          <strong>Title:</strong> Job position/title
                        </li>
                        <li>
                          <strong>Subtitle:</strong> Brief description of your
                          role
                        </li>
                        <li>
                          <strong>Location:</strong> Company location
                        </li>
                        <li>
                          <strong>Start Date:</strong> Employment start date
                        </li>
                        <li>
                          <strong>End Date:</strong> Employment end date (leave
                          empty if current)
                        </li>
                        <li>
                          <strong>Description:</strong> Detailed story of your
                          work and achievements
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>
                          ✏️ <strong>Edit:</strong> Click the edit button to
                          modify existing entries
                        </li>
                        <li>
                          🗑️ <strong>Delete:</strong> Remove entries from your
                          experience list
                        </li>
                        <li>
                          💾 <strong>Save:</strong> Click save button to store
                          your changes
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Project Management */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Managing Projects</h3>

                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Manage your project portfolio by adding details like
                      title, description, technologies used, external links, and
                      gallery images. Each project is displayed on your public
                      portfolio page.
                    </p>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Form Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <strong>Thumbnail:</strong> Project preview image
                      </li>
                      <li>
                        <strong>Banner:</strong> Large project showcase image
                      </li>
                      <li>
                        <strong>Title:</strong> Project name
                      </li>
                      <li>
                        <strong>Description:</strong> Brief overview of the
                        project
                      </li>
                      <li>
                        <strong>Category:</strong> Project type/category
                      </li>
                      <li>
                        <strong>Technologies:</strong> Tools and technologies
                        used
                      </li>
                      <li>
                        <strong>Live Link:</strong> URL to live project
                      </li>
                      <li>
                        <strong>Repository Link:</strong> GitHub or source code
                        repository
                      </li>
                      <li>
                        <strong>Content:</strong> Detailed project description
                        and story
                      </li>
                      <li>
                        <strong>Gallery:</strong> Multiple project screenshots
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Gallery Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      After creating a project, you can add multiple images to
                      create a gallery:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li>📸 Upload multiple project screenshots</li>
                      <li>🔄 Reorder images by dragging</li>
                      <li>🗑️ Delete unwanted images</li>
                      <li>👁️ Preview images before saving</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-900 dark:text-green-100">
                  <strong>💡 Tip:</strong> Use high-quality images for better
                  presentation. Keep file sizes optimized for faster loading
                  times.
                </p>
              </div>
            </div>
          </div>
        );

      case "contributing":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Contributing</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">Getting Started</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Fork the repository</li>
                  <li>Clone your fork locally</li>
                  <li>Create a new branch for your feature</li>
                  <li>Make your changes</li>
                  <li>Push to your fork and submit a pull request</li>
                </ol>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-bold mb-3">
                  Development Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Follow the existing code style and conventions</li>
                  <li>Use TypeScript for type safety</li>
                  <li>Test your changes before submitting PR</li>
                  <li>Write clear commit messages</li>
                  <li>Update documentation if needed</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-bold mb-3">Repository</h3>
                <Button asChild className="w-full md:w-auto">
                  <a
                    href="https://github.com/rrrgho/rianiregho-web.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 justify-center"
                  >
                    <Github className="h-4 w-4" />
                    Visit GitHub Repository
                  </a>
                </Button>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong>Clone URL:</strong>{" "}
                  <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                    https://github.com/rrrgho/rianiregho-web.git
                  </code>
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-bold text-lg mb-4">Documentation</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 text-sm ${
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground font-bold"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3 pb-10">
            <div className="prose dark:prose-invert max-w-none">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
