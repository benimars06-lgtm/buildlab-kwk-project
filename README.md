# Community Hub 🏘️

A community platform where people can share posts, organize events, and collect resources. Built with Next.js, TypeScript, Tailwind CSS, and Neon Postgres.

This is your team's project for the BuildLab. The app is partially built — your job is to finish it by completing your assigned tickets using AI-assisted development.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser. You should see three sample communities.

> **Your database is already connected!** A `.env.local` file with your team's database credentials has been pre-configured. You don't need to set up a database — just start building.

## What's Already Built

| Feature                                                                  | Status  |
| ------------------------------------------------------------------------ | ------- |
| Project setup (Next.js, TypeScript, Tailwind)                            | ✅ Done |
| Database schema (users, communities, posts, events, resources, comments) | ✅ Done |
| Sample data (3 communities, 4 users, posts, events, resources)           | ✅ Done |
| Site layout (header with login, footer)                                  | ✅ Done |
| Homepage listing all communities                                         | ✅ Done |
| Community page (placeholder)                                             | ✅ Done |
| Events page (placeholder)                                                | ✅ Done |
| Post detail page (shows post, comments placeholder)                      | ✅ Done |
| Profile page (placeholder)                                               | ✅ Done |
| Dev-mode login (click to log in as a sample user)                        | ✅ Done |

## What You'll Build (Your Tickets)

The placeholder pages have comments telling you exactly which tickets will modify them. Each ticket is a complete, independent, full-stack feature.

## Project Structure

```
community-hub/
├── src/
│   ├── app/                    # Pages and API routes (Next.js App Router)
│   │   ├── page.tsx            # Homepage — lists all communities
│   │   ├── layout.tsx          # Root layout (header, footer, auth)
│   │   ├── error.tsx           # Error boundary (friendly error messages)
│   │   ├── loading.tsx         # Loading state (spinner)
│   │   ├── [communitySlug]/    # Community pages
│   │   │   ├── page.tsx        # Community homepage (placeholder)
│   │   │   ├── events/
│   │   │   │   └── page.tsx    # Events list (placeholder)
│   │   │   └── posts/
│   │   │       └── [postId]/
│   │   │           └── page.tsx # Post detail page
│   │   ├── profile/
│   │   │   └── page.tsx        # User profile (placeholder)
│   │   └── api/                # API routes (you'll create these)
│   │       └── auth/
│   │           └── route.ts    # Auth placeholder
│   ├── components/             # Reusable React components
│   │   ├── Header.tsx          # Site header with login
│   │   ├── Footer.tsx          # Site footer
│   │   └── CommunityNav.tsx    # Community tab navigation
│   ├── db/                     # Database files
│   │   ├── schema.ts           # Table definitions (Drizzle ORM)
│   │   ├── index.ts            # Database connection
│   │   └── seed.ts             # Fills tables with sample data
│   ├── lib/                    # Shared utilities
│   │   ├── auth.tsx            # Dev-mode fake authentication
│   │   └── seed-users.ts       # Sample user data for dev login
│   └── types.ts                # Shared TypeScript types
├── .env.local                  # Database connection string (pre-configured)
├── drizzle.config.ts           # Drizzle ORM configuration
└── package.json
```

## How Login Works (Dev Mode)

Click "Log in" in the header and pick one of the four sample users. This is fake authentication for development — no real accounts needed. When you're ready for real auth, you can replace `src/lib/auth.tsx` with a proper auth library.

> **⚠️ A note about auth in this scaffold:** The login state lives entirely in the browser (React state). Server Components and API routes have no way to verify who is logged in. This means when you build API routes for your tickets, you'll pass the user ID from the client and the server will trust it. This is fine for learning — but in a real production app, you'd use server-side sessions (cookies) so the server can verify the user independently.

## Useful Commands

| Command                | What it does                                      |
| ---------------------- | ------------------------------------------------- |
| `pnpm run dev`         | Start the dev server at localhost:3000            |
| `pnpm run db:push`     | Create/update database tables from the schema     |
| `pnpm run seed`        | Fill the database with sample data                |
| `pnpm run build`       | Build for production                              |
| `pnpm run lint`        | Check your code for bugs and bad patterns (ESLint)|
| `pnpm run format`      | Auto-format all files to match team style (Prettier)|
| `pnpm run format:check`| Check if files are formatted (doesn't change anything)|

> **Note:** You shouldn't need to run `db:push` or `seed` — your database is already set up. These commands are here in case you need to reset your database or apply schema changes from a ticket.

## Tech Stack

- **Next.js 16** — React framework with App Router
- **TypeScript** — Type-safe JavaScript
- **Tailwind CSS** — Utility-first CSS
- **Drizzle ORM** — Type-safe database queries
- **Neon Postgres** — Cloud PostgreSQL database
