# Premium Card Design Pattern

## Purpose
Document the premium card design pattern used throughout the Paddle Up application for consistent, professional, and visually appealing section layouts.

## Core Design Elements

### 1. Container Structure
```tsx
<div className="relative overflow-hidden">
  <div className="bg-gradient-to-br from-[color]/5 via-surface to-[accent-color]/5 rounded-3xl p-8 md:p-12 border border-[color]/20 shadow-2xl">
    {/* Content */}
  </div>
</div>
```

### 2. Section Headers
**Pattern:**
```tsx
<div className="text-center mb-12">
  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[color] to-[color]/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
    <Icon className="h-10 w-10 text-white" />
  </div>
  <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
    🏅 Section Title
  </h2>
  <p className="text-xl text-text-muted max-w-2xl mx-auto">
    Descriptive subtitle text
  </p>
</div>
```

**Key Elements:**
- Animated circular icon background with gradient
- Large, bold typography with emoji prefix
- Centered layout with max-width subtitle
- Hover animations for interactivity

### 3. Interactive Cards
**Pattern:**
```tsx
<div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[color]/20 via-[color]/10 to-[color]/5 border-2 border-[color]/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
  <div className="flex items-center gap-4">
    <div className="flex-shrink-0">
      <div className="w-16 h-16 bg-gradient-to-br from-[color] to-[color]/80 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-2xl font-black text-white">Icon/Text</span>
      </div>
    </div>
    <div className="flex-grow">
      <div className="text-lg font-bold text-text-main mb-1">Title</div>
      <div className="text-text-muted">Description</div>
    </div>
    <div className="text-3xl opacity-50">🎯</div>
  </div>
</div>
```

**Key Elements:**
- Gradient backgrounds with low opacity
- Rounded borders with matching color
- Hover effects (scale + shadow)
- Circular badge with gradient background
- Emoji accent on the right side

### 4. Grid Cards
**Pattern:**
```tsx
<div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color]/10 to-[color]/5 border-2 border-[color]/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
  <div className="text-center">
    <div className="text-4xl mb-4">🎯</div>
    <h3 className="text-xl font-bold text-text-main mb-3">Title</h3>
    <div className="space-y-2">
      <div className="text-2xl font-black text-[color]">Value</div>
      <div className="text-text-muted font-medium">Description</div>
    </div>
  </div>
  <div className="absolute top-0 right-0 w-16 h-16 bg-[color]/5 rounded-full blur-xl"></div>
</div>
```

### 5. Background Decorative Elements
**Pattern:**
```tsx
{/* Inside main container */}
<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[color]/10 to-transparent rounded-full blur-2xl -z-10"></div>
<div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[accent-color]/10 to-transparent rounded-full blur-2xl -z-10"></div>
```

## Color Scheme Guidelines

### Primary Colors by Section:
- **Championship/Awards**: `warning` (gold theme)
- **Schedule/Time**: `primary` (blue theme)  
- **Competition/Games**: `success` (green theme)
- **Features/Details**: `text-accent` (purple theme)
- **Information**: Mix of `primary` and `success`

### Opacity Levels:
- Background gradients: `/5` to `/10`
- Border colors: `/20` to `/30`
- Decorative elements: `/5` to `/10`
- Card backgrounds: `/10` to `/20`

## Typography Hierarchy

### Section Headers:
- Main title: `text-4xl md:text-5xl font-black`
- Subtitle: `text-xl text-text-muted`

### Card Titles:
- Primary: `text-2xl font-bold text-text-main`
- Secondary: `text-lg font-bold text-text-main`

### Content:
- Values: `text-2xl font-black text-[color]`
- Description: `text-text-muted font-medium`

## Animation Guidelines

### Hover Effects:
- Scale: `hover:scale-105` or `hover:scale-[1.02]`
- Shadow: `hover:shadow-xl`
- Duration: `transition-all duration-300`

### Icon Animations:
- Scale on hover: `hover:scale-110`
- Transition: `transition-all duration-300`

## Spacing & Layout

### Container Padding:
- Base: `p-8 md:p-12`
- Cards: `p-6`
- Small cards: `p-4`

### Margins:
- Section spacing: `space-y-16`
- Header margin: `mb-12`
- Card spacing: `gap-6` to `gap-8`

### Border Radius:
- Main containers: `rounded-3xl`
- Cards: `rounded-2xl` 
- Small elements: `rounded-xl`

## Implementation Checklist

- [ ] Use semantic color variables from tailwind config
- [ ] Include hover animations on interactive elements
- [ ] Add decorative background blur elements
- [ ] Implement responsive grid layouts
- [ ] Use proper z-indexing for overlays
- [ ] Include emoji accents where appropriate
- [ ] Ensure proper contrast ratios
- [ ] Test on mobile and desktop viewports

## Example Section Implementation

```tsx
{/* Premium Section */}
<div className="relative overflow-hidden">
  <div className="bg-gradient-to-br from-primary/5 via-surface to-success/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl">
    {/* Header */}
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
        <Target className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
        🎯 Section Title
      </h2>
      <p className="text-xl text-text-muted max-w-2xl mx-auto">
        Section description
      </p>
    </div>
    
    {/* Content Grid */}
    <div className="grid md:grid-cols-3 gap-8">
      {/* Cards here */}
    </div>

    {/* Decorative Background Elements */}
    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
  </div>
</div>
