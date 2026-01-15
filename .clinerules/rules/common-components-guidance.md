# Common Components Usage Guidance

## Purpose
Ensure UI consistency, maintainability, and rapid development by always using shared/common components before creating custom UI in Paddle Up.

## Guidance

- **Always use existing common components** (e.g., `PremiumSection`, `SectionHeader`, `StatsCard`, `FeatureCard`, `PlayerAvatar`, `Button`) for layouts, cards, avatars, and section headers.
- **Check `src/components/ui/` for available abstractions** before implementing new UI patterns.
- **If a new UI pattern is needed**, first consider generalizing an existing component or adding a new common component for reuse.
- **Manual or custom UI markup should only be used** when no suitable common component exists and after evaluating the possibility of abstraction.
- **Keep common components well-documented** and update their usage examples as patterns evolve.
- **Review FormatPage, HomePage, and PlayersPage** for canonical usage of common components and design patterns.

## Implementation Checklist

- [ ] Prefer common components for all new UI
- [ ] Refactor duplicated UI into shared components
- [ ] Document new common components in this directory
- [ ] Update this guidance as new patterns/components are introduced
