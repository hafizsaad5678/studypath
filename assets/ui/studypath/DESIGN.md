---
name: StudyPath
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system focuses on a **Modern Corporate/Minimalist** aesthetic tailored for high-performance learning environments. The brand personality is authoritative and trustworthy, aiming to reduce cognitive load while maintaining high information density. 

The visual direction prioritizes clarity through a structured grid, generous white space, and a restricted color palette. It avoids decorative flourishes like heavy gradients or blurs, opting instead for crisp edges, precise alignment, and functional hierarchy. The emotional response should be one of focused productivity and academic rigor.

## Colors
The palette is anchored by **Deep Navy (#0F172A)** for primary text and navigation elements to establish authority. **Primary Blue (#2563EB)** is used exclusively for interactive elements and primary actions to ensure high findability. 

**Subtle Green (#10B981)** acts as a positive reinforcement color for progress completion and "on-track" states. The background uses **#F8FAFC**, a cool-toned white that reduces eye strain during long study sessions. Text contrast must always meet WCAG AA standards against this background.

## Typography
This design system utilizes **Inter** across all levels to maintain a systematic and utilitarian feel. The hierarchy is strictly enforced through weight and scale. 

- **Headlines:** Use Semi-Bold (600) or Bold (700) with slight negative letter-spacing to appear tighter and more professional.
- **Body Text:** Standard weight (400) for maximum readability. Use `body-sm` for secondary metadata to maintain high information density.
- **Labels:** Use `label-md` for section headers and category tags, often paired with all-caps and increased letter spacing to distinguish from body copy.

## Layout & Spacing
The system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. A strict 4px/8px base unit is used for all internal component spacing to ensure mathematical harmony.

- **Information Density:** Components like tables and lists should use "compact" padding (8px - 12px) to allow more data to be visible above the fold.
- **Mobile Layout:** Incorporates a fixed bottom navigation bar for primary app destinations, with a safe area margin of 16px.
- **Sidebars:** Desktop layouts use a fixed-width left navigation (240px) to maximize the main content area for learning materials.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** rather than shadows. 
- **Level 0 (Background):** #F8FAFC.
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF) with a 1px border of #E2E8F0.
- **Level 2 (Popovers/Modals):** Pure White with a subtle, highly diffused shadow (0 10px 15px -3px rgba(15, 23, 42, 0.08)).

Avoid heavy drop shadows. Use 1px borders in #E2E8F0 to define boundaries between sections, creating a "flat but layered" appearance that feels clean and modern.

## Shapes
The design uses a **Soft (0.25rem)** roundedness level. This subtle rounding maintains a professional and precise look while softening the "industrial" feel of sharp corners. 
- **Small Elements:** Buttons and inputs use 4px (0.25rem).
- **Large Elements:** Dashboard cards and containers use 8px (0.5rem).
- **Progress Bars:** Use a full pill-shape (999px) to contrast against the structured rectangular layout.

## Components
- **Primary Buttons:** Solid #2563EB with white text. 12px 20px padding. Focus states should show a 2px offset ring.
- **Status Badges:** Use a "tinted" background style (e.g., Error is a light red background with dark red text). This ensures accessibility while categorizing urgency (High, Medium, Low).
- **Progress Indicators:** Multi-step horizontal bars for desktop; compact circular rings or simple step counts for mobile.
- **Search Bars:** Full-width with a subtle 1px border. Include a keyboard shortcut hint (e.g., "Cmd + K") to emphasize the pro-user SaaS nature.
- **Comparison Tables:** Minimal borders, using alternating row stripes (Zebra striping) in #F8FAFC for readability. Bold the "current" or "recommended" path.
- **Timeline/Deadlines:** Vertical steppers with localized "Urgency Icons" (clocks for soon, checkmarks for done) using the status color palette.
- **Dashboard Cards:** No shadows; 1px #E2E8F0 border. Header, Content, and Footer sections separated by horizontal rules.