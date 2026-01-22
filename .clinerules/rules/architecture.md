# Paddle Up Frontend Architecture

## Overview
This project uses a strict separation of concerns between logic and presentation to maximize maintainability and enable easy UI overhauls.

## Key Patterns

### 1. Container/View (Presentational/Container) Pattern
- **Container Components** (`Component.tsx`): Handle state, data fetching, and event handlers. Never render UI directly.
- **View Components** (`ComponentView.tsx` in `src/views/`): Pure presentational components. Receive all data and callbacks via props. No data fetching or business logic.

### 2. Folder Structure
- `src/pages/`: All page-level containers.
- `src/views/`: All `*View.tsx` files for easy UI isolation.
- `src/components/ui/`: Pure, reusable UI components.
- `src/components/`: Feature containers (logic) for each major UI section.
- `src/hooks/`: Custom hooks for data/state logic.
- `src/lib/`: Domain logic, calculations, and utilities.

### 3. Data Flow
- Data flows from containers → views → UI components.
- Domain logic and data fetching are never in view/UI components.

### 4. Adding or Refactoring Features
- For every major UI section, create a container and a view.
- Place all business logic in containers/hooks/lib.
- Pass only minimal, typed props to views.
- All *View.tsx files must be in `src/views/` and imported by their container.

### 5. Benefits
- **UI Overhaul Ready:** You can redesign or swap out any view component without touching business logic.
- **Testability:** Logic and UI can be tested independently.
- **Consistency:** All major UI follows the same pattern, making onboarding and maintenance easier.

## Example

```tsx
// src/components/FeaturePanel.tsx (container)
import FeaturePanelView from '../views/FeaturePanelView';
const FeaturePanel = () => {
  const data = useFeatureData();
  const [expanded, setExpanded] = useState(false);
  return (
    <FeaturePanelView
      data={data}
      expanded={expanded}
      onToggle={() => setExpanded(v => !v)}
    />
  );
};
export default FeaturePanel;

// src/views/FeaturePanelView.tsx (view)
const FeaturePanelView = ({ data, expanded, onToggle }) => (
  <div>
    <button onClick={onToggle}>Toggle</button>
    {expanded && <div>{data.title}</div>}
  </div>
);
```

## Migration Status (2026-01)
- [x] All major components split into container and view.
- [x] All *View.tsx files live in `src/views/`.
- [x] Logic components import and render their corresponding view, passing all props.
- [x] Common UI components are reused for consistency.
- [x] Custom hooks encapsulate domain/data logic.

## Rationale
This structure enables rapid UI redesign, easier testing, and clear separation of concerns. It is ideal for scaling, theming, or migrating to a different UI library in the future.
