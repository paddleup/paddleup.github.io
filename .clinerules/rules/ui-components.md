# UI Components Guide — Minimal Design System

This document describes the new minimal design system for Paddle Up, inspired by Linear and Notion.

## Design Principles

1. **Simplicity over decoration** — No gradients, blur effects, or decorative elements
2. **Typography-driven hierarchy** — Font weight and size create visual order
3. **Subtle depth** — Single-level borders, no layered shadows
4. **Generous whitespace** — Clear breathing room between elements
5. **Consistent density** — Predictable spacing using Tailwind's scale

## Color Tokens

Use semantic color tokens instead of raw Tailwind colors:

### Backgrounds

| Token          | Usage                                            |
| -------------- | ------------------------------------------------ |
| `bg-bg`        | Main page background                             |
| `bg-bg-subtle` | Subtle background (cards, panels)                |
| `bg-bg-muted`  | Muted background (hover states, secondary areas) |

### Foregrounds

| Token            | Usage                           |
| ---------------- | ------------------------------- |
| `text-fg`        | Primary text                    |
| `text-fg-muted`  | Secondary/muted text            |
| `text-fg-subtle` | Placeholder text, tertiary info |

### Borders

| Token                  | Usage              |
| ---------------------- | ------------------ |
| `border-border`        | Standard borders   |
| `border-border-strong` | Emphasized borders |

### Accent & Semantic

| Token                         | Usage                                 |
| ----------------------------- | ------------------------------------- |
| `text-accent` / `bg-accent`   | Primary actions, links                |
| `text-success` / `bg-success` | Success states                        |
| `text-warning` / `bg-warning` | Warning states                        |
| `text-error` / `bg-error`     | Error states                          |
| `bg-*-subtle`                 | Lighter backgrounds for badges/alerts |

## Core Components

### Button

```tsx
import { Button } from '../components/ui';

// Variants: default, primary, secondary, ghost, destructive
<Button variant="primary">Save</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="destructive" size="sm">Delete</Button>

// With loading state
<Button loading>Saving...</Button>

// With icon
<Button icon={<Icon />}>Action</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Simple card with padding
<Card padding="lg">Simple content</Card>
```

### Heading

```tsx
import { Heading } from '../components/ui';

<Heading as="h1">Page Title</Heading>
<Heading as="h2" description="Optional subtitle">Section Title</Heading>
```

### Form Components

```tsx
import { Input, Select, Label, ErrorText } from '../components/ui';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
  <ErrorText>Invalid email address</ErrorText>
</div>

<Select>
  <option value="">Select an option</option>
  <option value="1">Option 1</option>
</Select>
```

### Badge

```tsx
import { Badge } from '../components/ui';

// Variants: default, success, warning, error, accent
<Badge>Default</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="error">Failed</Badge>
```

### Avatar

```tsx
import { Avatar } from '../components/ui';

// Sizes: sm, md, lg, xl
<Avatar src="/user.jpg" alt="John Doe" size="lg" />
<Avatar fallback="JD" />
```

### Stat

```tsx
import { Stat, StatGroup } from '../components/ui';

<StatGroup columns={3}>
  <Stat label="Total Points" value="1,234" />
  <Stat label="Win Rate" value="67%" trend="up" />
  <Stat label="Rank" value="#3" description="Out of 24 players" />
</StatGroup>;
```

### List

```tsx
import { List, ListItem } from '../components/ui';

<List divided>
  <ListItem>
    <span>Item label</span>
    <Button size="sm">Action</Button>
  </ListItem>
</List>;
```

### ThemeToggle

```tsx
import { ThemeToggle } from '../components/ui';

// In your header/nav
<ThemeToggle />
<ThemeToggle showLabel />
```

## Layout Patterns

### Page Container

```tsx
<div className="mx-auto max-w-4xl px-4 py-8">
  <Heading as="h1">Page Title</Heading>
  {/* Content */}
</div>
```

### Section Spacing

```tsx
<div className="space-y-6">
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### Grid Layout

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id}>...</Card>
  ))}
</div>
```

## Migration from Legacy Components

| Legacy Component | New Component                                  |
| ---------------- | ---------------------------------------------- |
| `PremiumSection` | `Section` or just use `<div className="py-8">` |
| `SectionHeader`  | `Heading`                                      |
| `StatsCard`      | `Stat` + `Card`                                |
| `FeatureCard`    | `Card` with custom content                     |
| `PlayerAvatar`   | `Avatar`                                       |

## Do's and Don'ts

### DO

- Use semantic color tokens (`bg-bg`, `text-fg-muted`)
- Use consistent spacing (`space-y-4`, `gap-6`)
- Keep component props minimal
- Use `rounded-lg` for subtle corners

### DON'T

- Use raw Tailwind colors (`bg-slate-800`, `text-gray-400`)
- Add gradients, blurs, or decorative elements
- Use scale transforms on hover (`hover:scale-105`)
- Add complex shadows (`shadow-2xl`)

## Theming

The app supports light, dark, and system themes:

```tsx
import { useTheme } from '../hooks/useTheme';

const { theme, setTheme, isDark } = useTheme();

// Set theme
setTheme('light'); // Force light
setTheme('dark'); // Force dark
setTheme('system'); // Follow system preference
```

Theme is persisted in localStorage under `paddleup-theme`.
