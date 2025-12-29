# Agent Quick Guide (Template)

This template inherits the main project conventions so you can spin up a new module/app with the same stack.

## Project Overview

### Tech Stack
- **Frontend**: React + Vite + TypeScript, Tailwind CSS 4
- **Component Library**: shadcn/ui (base components under `src/components/ui/`)
- **Custom Components**: `src/components/` (layout + business helpers such as `PageContainer`, `StatusBadge`)
- **Routing**: `HashRouter`; `src/routes/index.tsx` selects routes based on `VITE_APP_TYPE` (dev/SPA aggregates all modules, single-module build renders the matching set)
- **API**: `src/api/request.ts` wraps axios; default `baseURL=VITE_API_BASE_URL` (fallback `/api`), auto `Authorization: Bearer <token>` from `localStorage.token`; success if `data.success` or `code 200/0`
- **Internationalization**: `react-i18next`; language packs in `src/i18n/locales/{zh,en}`; default language from `localStorage.lang` (`zh-cn`/`en-us`)
- **Backend (reference)**: Node-RED Event Flow handles HTTP; writes forwarded via MQTT; queries via PostgreSQL nodes returning JSONB `json` field

### Directory Structure
- `doc/spec/Spec-Template.md`: specification template for new modules
- `src/routes/`: route definitions and module mapping
- `src/pages/Template/`: sample page (search card + list card + status badge + toast)
- `src/api/modules/`, `src/types/`: API helpers and types
- `src/components/`: layout/common components; `src/components/ui/` holds shadcn base components
- (Optional) `flows/`: add Node-RED flow JSONs here if the module needs backend flows

## Development Standards

### UI and Interaction
- **Visual**: Light-gray background (`bg-muted`), wrap content in white Cards, generous spacing; high-contrast, restrained, function-first
- **Colors**: Primary buttons use dark background + white text; secondary use `variant="outline"`; dangerous actions use `ghost/outline` with red indicators; avoid bright brand colors
- **Patterns**: Prefer shadcn components; page scaffold = `PageContainer` + Cards; list pages use search card + list card + toast + i18n; action column uses text labels (no icon-only buttons)
- **States**: Status pills are rounded-full, small text, colored backgrounds per state (yellow=in-progress, green=done, red=error, gray=default)

### API and Data Contracts
- Use `request.get/post/...`, returns `Promise<ApiResponse<T>>`; handle errors via `try/catch`
- Pagination params: `current`, `pageSize`; response: `records/total`
- Auth token in `localStorage.token`, auto-injected by interceptor; 401/403/404/500 logged centrally
- For custom baseURL/timeout, create new axios instance via `createAxiosInstance`

### Internationalization
- All visible text goes through i18n keys; keep key hierarchies consistent across `zh/en`
- When adding a module, create same-named files in each locale and merge in `index.ts`

### Routing and Modules
- Route keys must align with `VITE_APP_TYPE`; mapping defined in `src/routes/index.tsx`
- In dev/SPA, all modules load; single-module build only renders the matching route set

## New Feature/Module Development
1. **Routing**: Add a new route file under `src/routes` and register it in `src/routes/index.tsx`.
2. **Build script**: Add `"build:<module>" : "tsc -b && cross-env VITE_BASE_PATH=/app-<module> VITE_APP_TYPE=<module> vite build"` to `package.json`; `<module>` must match the route key.
3. **Pages**: Place pages in `src/pages/<Module>/`; wrap with `PageContainer`, use Cards, follow style/i18n rules.
4. **API/Types**: Add API methods in `src/api/modules/`; define types in `src/types/`; follow `ApiResponse` structure.
5. **Backend Flow (optional)**: If needed, place Node-RED flow JSON in `flows/` and keep it in sync with spec.

## Running and Building
- Dev: `npm run dev`
- Build module: `npm run build:module`
- SPA preview: `npm run preview` (builds SPA preview under configured base path)
- Lint: `npm run lint`

## References
- Style guide: root `doc/prompt/样式要求.md`
- Spec template: `doc/spec/Spec-Template.md`
- Route/Page examples: `src/routes/`, `src/pages/Template/`
- API wrapper: `src/api/request.ts`
- i18n usage: `src/i18n/index.ts`, locale files under `src/i18n/locales/{zh,en}`