
# Tailwind + Headless UI Theming — ClineRules Guide

## Purpose
Provide consistent strategies and reusable patterns for theming modern React applications using Tailwind CSS and Headless UI.

## 1. Tailwind Theme Customization
Define global brand tokens in `tailwind.config.js`.

### Example:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#00A86B",
          secondary: "#003B5C",
          accent: "#F5C542",
        }
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      }
    }
  }
}
```

### Usage:
```html
<div class="bg-brand-primary text-white">...</div>
```

## 2. CSS Variables for Dynamic Themes
Supports light/dark, tournament mode, seasonal themes.

### Variables
```css
:root {
  --color-primary: 0 168 107;
  --color-secondary: 0 59 92;
}
[data-theme="tournament"] {
  --color-primary: 242 79 47;
  --color-secondary: 18 18 18;
}
```

### Tailwind mapping
```js
extend: {
  colors: {
    primary: "rgb(var(--color-primary) / <alpha-value>)",
    secondary: "rgb(var(--color-secondary) / <alpha-value>)",
  }
}
```

### Switch themes
```js
document.documentElement.dataset.theme = "tournament";
```

## 3. Reusable Utility Classes
```css
.btn {
  @apply px-4 py-2 rounded-xl font-semibold transition bg-brand-primary text-white hover:bg-brand-secondary;
}
.btn-outline {
  @apply border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white;
}
.card {
  @apply bg-white shadow-md p-6 rounded-2xl;
}
```

## 4. Branded Headless UI Components
```tsx
import { Menu } from '@headlessui/react';
export function BrandMenu({ children }) {
  return (
    <Menu>
      <Menu.Button className="btn">Options</Menu.Button>
      <Menu.Items className="mt-2 w-48 bg-white shadow-lg rounded-xl p-2">{children}</Menu.Items>
    </Menu>
  );
}
```

## 5. Use Design Tokens
- colors
- typography
- radii

Store tokens in Tailwind config or CSS variables.

## 6. Tailwind `@layer`
```css
@layer components {
  .panel { @apply bg-gray-50 border rounded-xl p-4 shadow-sm; }
}
```

## 7. Dark Mode
```js
darkMode: "class"
```

```html
<div class="bg-white dark:bg-gray-900">...</div>
```

## Recommended Strategy
1. Tailwind theme customization
2. CSS variables
3. @apply utility classes
4. Headless UI wrappers
