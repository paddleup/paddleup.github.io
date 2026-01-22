# Pages Directory

## Purpose
This folder contains all top-level route containers for the Paddle Up app. Each page is split into:

- `[Page].tsx`: Container component (logic, data, state)
- `[Page]View.tsx` (in `src/views/`): Presentational component (UI only, receives props)

## Guidelines

- Do not put business logic or data fetching in `*View.tsx` files.
- Keep containers focused on wiring data and handlers to the view.
- All view components are now located in `src/views/`. Update imports in containers to reference this folder.

## Example

```
src/pages/
  HomePage.tsx
  EventPage.tsx
src/views/
  HomePageView.tsx
  EventPageView.tsx
