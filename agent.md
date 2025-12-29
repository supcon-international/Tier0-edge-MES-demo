# Agent Quick Guide

## Project Overview

### Tech Stack
- **Frontend**: React + Vite + TypeScript, Tailwind CSS 4
- **Component Library**: shadcn/ui (`src/components/ui/`), add components with: `npx shadcn@latest add <component-name>`
- **Custom Components**: `src/components/` (business components like `PageContainer`, `Paginator`, `DateTimePicker`, etc.)
- **Routing**: `HashRouter`, `src/routes/index.tsx` selects routes based on `VITE_APP_TYPE`; dev/SPA mode aggregates all modules, single module build only renders matching routes
- **API**: `src/api/request.ts` wraps axios, default `baseURL=VITE_API_BASE_URL` (falls back to `/api` if not configured), automatically adds `Authorization: Bearer <token>` header (`localStorage.token`). Success condition: `data.success` or `code 200/0`
- **Internationalization**: `react-i18next`, language packs in `src/i18n/locales/{zh,en}`, use `useTranslation()` to get `t`, language switcher in top-right of layout. Default language read from `localStorage.lang` (supports `zh-cn`/`en-us` format), defaults to English if not set
- **Backend**: Node-RED Event Flow handles HTTP requests; write operations forwarded via MQTT to database; queries use PostgreSQL nodes returning JSONB `json` field

### Directory Structure
- `doc/prompt/`: Architecture documentation, style requirements
- `doc/spec/`: Business requirements documentation
- `flows/`: Node-RED flow JSON files (corresponding to backend interface logic)
- `src/routes/`: Module route definitions, aggregated in `index.tsx`
- `src/pages/`: Page components organized by module
- `src/api/modules/`: Business module API methods
- `src/types/`: Request/response type definitions
- `src/components/`: Layout, common interactive components; `src/common/menuItems.tsx` sidebar configuration

## Development Standards

### UI and Interaction Conventions
- **Visual**: Light gray background (`bg-muted`), content wrapped in white Cards; generous spacing, main content area centered with max-width constraint; high contrast, restrained and function-driven
- **Colors**: Primary buttons with dark background + white text; secondary actions use `variant="outline"`; dangerous actions use `ghost/outline` with red indicators; avoid bright brand blue/green
- **Components**: Prefer shadcn components; layout recommendation: `PageContainer` + multiple `Card`s; list page common pattern: search card + list card + `TableBodySkeleton` + `Paginator` + `toast/sonner` + i18n
- **Text**: All visible text should use i18n entries, maintain consistent key hierarchy; avoid hardcoding

### API and Data Contracts
- **Request Wrapper**: Use `request.get/post/...`, returns `Promise<ApiResponse<T>>`; errors require `try/catch`
- **Pagination**: Common parameters `current`, `pageSize`, response contains `records/total`
- **Authentication**: Token stored in `localStorage.token`, automatically added by interceptor; 401/403/404/500 handled with unified logging
- **Custom Instances**: Use `createAxiosInstance` to pass independent `baseURL` or timeout configuration

### Internationalization
- **Language Packs**: `src/i18n/locales/zh|en`, module files aggregated in `index.js` (each module corresponds to an independent language file)
- **Usage**: Use `useTranslation()` to get `t`; use placeholders for parameterized text
- **Adding New Module**: Add same-named file in each language directory and merge in respective `index.js`; register new language in `src/i18n/index.ts` if necessary

### Routing and Modules
- **Route Keys**: Must align with `VITE_APP_TYPE`, define route module mapping in `src/routes/index.tsx`
- **Sidebar Configuration**: Configure menu items in `src/common/menuItems.tsx`, visible in dev/SPA mode (see `Layout.tsx`)

## New Feature/Module Development

### Development Steps
1. **Routing**: Create new route file in `src/routes` and add to `index.tsx` mapping; for single module build, also add corresponding `build:<module>` script in `package.json`, format: `"build:<module>": "tsc -b && cross-env VITE_BASE_PATH=/app-<module> VITE_APP_TYPE=<module> vite build"`
2. **Pages**: Place in `src/pages/<Module>/`, wrap with `PageContainer`, put forms/lists in Cards, follow style guide and i18n
3. **API/Types**: Create API methods in `src/api/modules/`; put common types in `src/types/`; follow existing `ApiResponse` structure
4. **Component Reuse**: Prefer existing components; follow Tailwind + shadcn combination style
5. **Backend Integration**: When updating/adding interfaces, maintain `flows/*.json` (Node-RED) to ensure data flow matches requirements documentation

## Running and Building

- **Development**: `npm run dev` (default http://localhost:5173)
- **Preview**: `npm run preview` (builds SPA preview, see `package.json` for specific path)
- **Full Build**: `npm run build` (builds all `build:*` scripts in parallel, outputs to `dist/{module-name}/`)
- **SPA Build**: `npm run build:spa` (requires `VITE_BASE_PATH` and `VITE_APP_TYPE=spa` configuration)
- **Code Check**: `npm run lint`; cleanup: `npm run clean:dist`
- **Key Environment Variables**: `VITE_BASE_PATH` (deployment base path), `VITE_APP_TYPE` (must match key name in `src/routes/index.tsx`), `VITE_ANALYZE`

## Deployment Notes

- **multi mode**: `docker build -t app-multi .`, unified deployment of all modules, Konga route configuration (Strip Path=No), Keycloak URIs include corresponding paths
- **single mode**: `BUILD_MODE=single MODULE_NAME=<name> BASE_PATH=/app-<name>`; suitable for independent deployment or canary releases, Konga routes and Keycloak URIs need corresponding configuration
- **single hotfix**: `BASE_PATH=/`, hijack old paths via Konga route configuration (Strip Path=Yes)
- **spa mode**: `BUILD_MODE=spa BASE_PATH=/app-spa`; single entry deployment, Konga routes and Keycloak URIs need corresponding configuration

## References

- Style Requirements: `doc/prompt/样式要求.md`
- Requirements Specification: `doc/spec/`
- Route/Module Examples: `src/routes/`, `src/pages/`
- API Wrapper: `src/api/README.md`, `src/api/request.ts`
- Internationalization Usage: `src/i18n/README.md`
