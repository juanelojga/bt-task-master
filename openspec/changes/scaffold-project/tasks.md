## 1. Project Bootstrap

- [x] 1.1 Scaffold Vite React TypeScript project using `npm create vite@latest . -- --template react-ts`
- [x] 1.2 Enable `strict: true` in `tsconfig.json` and verify the dev server runs with `npm run dev`
- [x] 1.3 Clean up boilerplate files (remove default Vite demo content, App.css, etc.)

## 2. Folder Structure

- [x] 2.1 Create feature-based directory structure under `src/features/`
- [x] 2.2 Create `src/features/map/` directory for map-related code
- [x] 2.3 Create `src/features/store/` directory for zustand store code
- [x] 2.4 Create shared directories: `src/lib/` (utilities), `src/types/` (shared type definitions)

## 3. Tailwind CSS Setup

- [x] 3.1 Install Tailwind CSS and its peer dependencies (`tailwindcss`, `@tailwindcss/vite`)
- [x] 3.2 Configure Tailwind in `vite.config.ts` with the Tailwind plugin
- [x] 3.3 Add Tailwind directives to the main CSS entry file (`@import "tailwindcss"`)
- [x] 3.4 Verify Tailwind utility classes work by applying a class in App.tsx

## 4. ESLint & Prettier Configuration

- [x] 4.1 Replace default ESLint config with Flat Config (`eslint.config.js`)
- [x] 4.2 Install and configure ESLint plugins: `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
- [x] 4.3 Enable `@typescript-eslint/recommended-type-checked` rule set
- [x] 4.4 Set `@typescript-eslint/no-explicit-any` to `error`
- [x] 4.5 Install Prettier and create `.prettierrc` configuration file
- [x] 4.6 Install `eslint-config-prettier` and add it to ESLint config to disable conflicting rules
- [x] 4.7 Add `lint` script to `package.json` and verify ESLint runs cleanly

## 5. Husky & lint-staged

- [x] 5.1 Install and initialize Husky (`npx husky init`)
- [x] 5.2 Install lint-staged and configure it in `package.json` to run ESLint --fix and Prettier on staged files
- [x] 5.3 Set up the `pre-commit` hook to run `npx lint-staged`
- [x] 5.4 Verify the pre-commit hook rejects commits with lint errors

## 6. MapLibre GL Integration

- [x] 6.1 Install `maplibre-gl` as a runtime dependency
- [x] 6.2 Import `maplibre-gl/dist/maplibre-gl.css` in the application entry point
- [x] 6.3 Define TypeScript interfaces for map configuration (`MapConfig`, `LngLat`, `MapStyle`)
- [x] 6.4 Create a `MapContainer` React component that initializes a MapLibre GL map from config props
- [x] 6.5 Implement proper map cleanup on component unmount (call `map.remove()`)
- [x] 6.6 Verify the map renders in the browser with a default style (e.g., OSM tiles)

## 7. Zustand State Management

- [x] 7.1 Install `zustand` as a runtime dependency
- [x] 7.2 Create a typed store interface defining state properties and action functions
- [x] 7.3 Implement the initial zustand store using `create` with `devtools` middleware
- [x] 7.4 Create a custom hook that wraps store access with a selector for a specific state slice
- [x] 7.5 Verify the store works by reading and updating state from a component, and confirm actions appear in Redux DevTools

## 8. Verification

- [x] 8.1 Run `npm run build` and ensure no TypeScript or build errors
- [x] 8.2 Run `npm run lint` and ensure no lint errors
- [x] 8.3 Test a commit with the pre-commit hook to confirm lint-staged runs
- [x] 8.4 Verify the app renders in the browser with map and store working together
