# Shadcn UI Kit — Field-branded

A tactile recreation of the shadcn/ui primitives, re-skinned for Field.
Components are intentionally small, composable, and mainly cosmetic — they
mirror the look of shadcn, not its behavior.

## Files

- `index.html` — interactive demo. Opens on a Login card (matching the Figma
  auth pattern); on submit it swaps into a full dashboard shell.
- `Button.jsx` — 6 variants × 4 sizes, lucide icon support, loading state.
- `Form.jsx` — `Label`, `Input`, `Textarea`, `Field`, `Checkbox`.
- `Card.jsx` — `Card`, `CardHeader`, `StatCard`, `Badge`.
- `Sidebar.jsx` — dashboard shell with `Sidebar` + `Topbar`.
- `Table.jsx` — data-table with column render fns.
- `Chart.jsx` — SVG area chart using the 5-series palette.
- `Dashboard.jsx` — full dashboard composition (KPI row → chart + recent
  sales → tasks table).
- `Login.jsx` — the auth card.

## Usage notes

- Load order matters — `Button`, `Form`, `Card`, `Table`, `Chart` must
  load before `Sidebar`, `Dashboard`, `Login` (they reference each other
  via globals assigned to `window`).
- Font Awesome icons are loaded from CDN; components accept a Lucide-style
  name (`icon="chevron-right"`) which `faCls.jsx` maps to Font Awesome 6
  class strings. Unknown names fall back to `fa-solid fa-<name>`.
- All components assume the dark surface (`rgb(17,24,39)` card on
  `rgb(10,10,10)` page). For a light build swap the root class to
  `.light` on `<html>`.
