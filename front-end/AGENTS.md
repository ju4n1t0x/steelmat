# Agent Guidelines for SteelMat Front-End

## Build/Dev Commands
- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- No test suite configured

## Tech Stack
- Astro 5.16+ with Tailwind CSS 4.1+
- TypeScript (strict mode)
- Zod for validation
- Resend for email API

## Code Style
- **Imports**: Use `@/*` path alias for src imports (e.g., `@/components/...`)
- **Components**: Astro components in `.astro` files, organized by page/feature
- **Types**: Use TypeScript with strict mode, prefer `type` over `interface`
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Validation**: Define Zod schemas in `src/validation/` directory
- **API Routes**: Place in `src/pages/api/`, use `prerender = false` for dynamic routes
- **Error Handling**: Use try-catch with typed errors, return JSON responses with status codes
- **Formatting**: 2-space indentation, single quotes for strings
- **Images**: Use Astro's Image component from `astro:assets`, store in `src/assets/`
