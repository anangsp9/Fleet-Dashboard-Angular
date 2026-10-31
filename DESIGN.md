# Design System - Fleet Dashboard

## Color Palette

### Light Mode
- Primary: #f59e0b (Amber)
- Background: #fafafa (off-white)
- Surface: #ffffff (white)
- Text: #1f2937 (dark gray)
- Border: #e5e7eb (light gray)

### Dark Mode
- Primary: #f59e0b (Amber - accent)
- Background: #111827 (dark gray)
- Surface: #1f2937 (gray-800)
- Text: #f3f4f6 (light gray)
- Border: #374151 (gray-700)

### Status Colors (both modes adjusted)
- Success: #10b981 (green, adjusted for dark visibility)
- Error: #ef4444 (red, adjusted for dark visibility)
- Warning: #f59e0b (amber - doubles as warning)
- Pending: #6b7280 (gray, neutral)

## Typography (Mobile-First)
- H1: 40px / 700 (mobile 32px)
- H2: 32px / 600 (mobile 24px)
- H3: 24px / 600 (mobile 20px)
- H4: 20px / 600
- Body: 16px / 400
- Small: 14px / 400
- Xs: 12px / 400

Font: Inter (system fallback)
Line height: 1.5 (body), 1.2 (headings)

## Spacing Grid (8px base)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Components

### Buttons
- Solid: bg-amber-500 text-white, hover:bg-amber-600, dark:bg-amber-600 dark:hover:bg-amber-500
- Ghost: bg-transparent text-amber-600, hover:bg-amber-50, dark:hover:bg-slate-800
- Outline: border-2 border-amber-500 text-amber-600
- Size: sm (px-3 py-1.5 text-sm), md (px-4 py-2 text-base), lg (px-6 py-3 text-lg)
- Border radius: rounded-lg (12px)

### Cards
- Light: bg-white border border-neutral-200 shadow-md
- Dark: dark:bg-slate-800 dark:border-slate-700
- Padding: md (16px) to lg (24px)
- Border radius: rounded-lg (12px)
- Hover: shadow-lg transition-shadow

### Inputs & Forms
- Light: bg-white border-neutral-300 text-neutral-900
- Dark: dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100
- Focus: ring-2 ring-amber-500 border-amber-500
- Placeholder: text-neutral-500 dark:text-slate-400
- Border radius: rounded-lg (8px)

### Badges & Pills
- Status badge: inline-flex items-center px-md py-sm rounded-full text-xs font-500
- Success: bg-green-100 text-green-800, dark:bg-green-900 dark:text-green-100
- Error: bg-red-100 text-red-800, dark:bg-red-900 dark:text-red-100
- Warning: bg-amber-100 text-amber-800, dark:bg-amber-900 dark:text-amber-100
- Pending: bg-gray-100 text-gray-800, dark:bg-gray-900 dark:text-gray-100

### Tables
- Header: bg-neutral-50 dark:bg-slate-700 font-600
- Row hover: bg-neutral-50 dark:bg-slate-700
- Border: border-neutral-200 dark:border-slate-700
- Sticky header: sticky top-0
- Scrollable on mobile

### Modals & Dialogs
- Backdrop: bg-black/50 dark:bg-black/70
- Card: bg-white dark:bg-slate-800, rounded-xl (16px)
- Centered positioning, responsive width
- Close button: top-right corner

### Navigation
- Sidebar (desktop): bg-white dark:bg-slate-900, border-r border-neutral-200 dark:border-slate-700
- Hamburger menu (mobile): toggle sidebar or drawer
- Active state: bg-amber-50 text-amber-600, dark:bg-slate-700 dark:text-amber-500
- Hover state: bg-neutral-50 dark:bg-slate-800

## Responsive Breakpoints
- Mobile: <640px (single column, stacked)
- Tablet: 640px-1024px (2 columns, flexible)
- Desktop: >1024px (3+ columns, full grid)

## Interactive States
- Hover: Slight shadow/background shift, smooth transition (150ms)
- Focus: Primary ring outline (ring-2 ring-amber-500)
- Active: Highlighted with amber color
- Disabled: opacity-50, cursor-not-allowed
- Loading: spinner or skeleton

## Dark Mode Implementation
- Class-based: `dark:` prefix in Tailwind
- Toggle stored in localStorage
- Applied to `<html>` element
- Auto-detect system preference (optional)

## Accessibility
- Minimum contrast ratio 4.5:1 (AA standard)
- Touch targets: 44px min (mobile)
- Focus visible on all interactive elements
- Readable font sizes at all breakpoints
- Image alt text
- ARIA labels where needed
