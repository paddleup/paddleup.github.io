# Tailwind CSS & Theming Guidelines

## Purpose
Ensure consistent styling and easy theming across the Paddle Up application by using semantic CSS variables and Tailwind v4 configuration.

## Core Principles
1.  **No Hardcoded Colors**: Avoid using raw Tailwind color classes like `bg-slate-800`, `text-blue-500`, or `border-gray-200`.
2.  **Use Semantic Variables**: Always use the semantic variables defined in `src/index.css`.
3.  **Centralized Theming**: All theme colors are defined in `src/index.css`. Changing the theme should only require editing this file.

## Semantic Color Mapping

| Semantic Name | Usage | Tailwind Class |
| :--- | :--- | :--- |
| `background` | Main page background | `bg-background` |
| `surface` | Card/Container background | `bg-surface` |
| `surface-alt` | Alternative surface (e.g., table headers, secondary cards) | `bg-surface-alt` |
| `surface-highlight` | Hover states, active items | `bg-surface-highlight` |
| `text-main` | Primary text color | `text-text-main` |
| `text-muted` | Secondary/Subtle text color | `text-text-muted` |
| `text-accent` | Accent text color | `text-text-accent` |
| `border` | Border color | `border-border` |
| `primary` | Primary action color (buttons, links) | `bg-primary`, `text-primary` |
| `primary-hover` | Hover state for primary actions | `bg-primary-hover` |
| `primary-light` | Light background for primary items | `bg-primary-light` |
| `success` | Success states (e.g., wins, positive changes) | `bg-success`, `text-success` |
| `warning` | Warning states (e.g., gold medals, alerts) | `bg-warning`, `text-warning` |
| `error` | Error states (e.g., losses, validation errors) | `bg-error`, `text-error` |
| `bronze` | Bronze medal color | `bg-bronze`, `text-bronze` |

## Implementation Details

### `src/index.css`
This file contains the Tailwind v4 configuration and CSS variable definitions.

```css
@import "tailwindcss";

@theme {
  --color-background: var(--background);
  /* ... other mappings ... */
}

:root {
  /* Neptune Theme Values */
  --background: #0B1121;
  /* ... other values ... */
}
```

### Adding New Colors
1.  Define the CSS variable in `:root` in `src/index.css`.
2.  Map it to a Tailwind theme variable in the `@theme` block in `src/index.css`.
3.  Use the new class in your components (e.g., `bg-new-color`).

## Do's and Don'ts

**DO:**
*   Use `bg-surface` for card backgrounds.
*   Use `text-text-muted` for secondary labels.
*   Use `border-border` for dividers and borders.

**DON'T:**
*   Use `bg-slate-800` or `bg-[#151E32]`.
*   Use `text-gray-400` or `text-slate-400`.
*   Use `border-gray-700`.

## Example Component

```tsx
// Good
<div className="bg-surface border border-border p-4 rounded-lg">
  <h2 className="text-text-main font-bold">Title</h2>
  <p className="text-text-muted">Subtitle</p>
  <button className="bg-primary text-white hover:bg-primary-hover">
    Action
  </button>
</div>

// Bad
<div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
  <h2 className="text-white font-bold">Title</h2>
  <p className="text-slate-400">Subtitle</p>
  <button className="bg-blue-500 text-white hover:bg-blue-600">
    Action
  </button>
</div>
