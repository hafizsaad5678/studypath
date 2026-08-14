---
name: High-Contrast Stealth
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#bacbb9'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#859585'
  outline-variant: '#3b4a3d'
  surface-tint: '#00e475'
  primary: '#75ff9e'
  on-primary: '#003918'
  primary-container: '#00e676'
  on-primary-container: '#00612e'
  inverse-primary: '#006d35'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#e7e4e6'
  on-tertiary: '#303032'
  tertiary-container: '#cac8ca'
  on-tertiary-container: '#545356'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62ff96'
  primary-fixed-dim: '#00e475'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#005226'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e4e2e4'
  tertiary-fixed-dim: '#c8c6c8'
  on-tertiary-fixed: '#1b1b1d'
  on-tertiary-fixed-variant: '#474649'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
  surface-card: '#1c1c1e'
  surface-input: '#2c2c2e'
  text-primary: '#ffffff'
  text-secondary: '#a1a1aa'
  border-subtle: '#2c2c2e'
  neon-green: '#00e676'
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
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  card-padding: 24px
  stack-md: 16px
---

## Brand & Style

This design system evolves into a high-performance, dark-themed environment designed for deep focus and technical precision. The brand personality shifts from "Corporate Trust" to "Elite Performance," evoking the focused atmosphere of a premium developer tool or high-end fintech dashboard.

The aesthetic utilizes **Minimalism** with a heavy emphasis on **High-Contrast** elements. By using a pitch-black foundation and vibrant neon accents, the UI reduces peripheral distraction while making progress indicators and primary actions impossible to miss. The emotional response should be one of intense clarity, technological sophistication, and academic momentum.

## Colors

The palette is strictly dark-mode, optimized for OLED displays and long-duration study sessions. 

- **Primary:** Neon Green (#00e676) is used exclusively for success states, progress metrics, and active interactive indicators. It provides a piercing contrast against the dark background.
- **Surface:** The background is a true black (#000000). Component surfaces use a tiered charcoal (#1c1c1e) to create depth without relying on traditional drop shadows.
- **Interaction:** Active states use the neon primary color, while neutral actions use a high-contrast off-white/light grey. Hover states for dark surfaces should use a subtle lightening of the charcoal base (#2c2c2e).

## Typography

This system continues to leverage **Inter** for its systematic and neutral character, but adjusts its implementation for dark mode readability.

- **Contrast:** Headings use pure white (#FFFFFF) for maximum impact. Body copy and secondary labels use a slightly muted off-white (#A1A1AA) to prevent "vibration" and eye fatigue on dark backgrounds.
- **Emphasis:** Numerical data (like progress percentages or study hours) should be treated with `headline-md` or `headline-lg` to create a "Dashboard-first" information hierarchy.
- **Legibility:** Due to the dark background, line-height is kept generous to ensure text does not feel cramped in the high-density layout.

## Layout & Spacing

The design follows a **fixed grid** model for content containers to maintain the "card-heavy" look of the reference.

- **Grid:** A 12-column grid is used for desktop, but components are grouped into distinct high-radius cards. 
- **Density:** Spacing between cards is wide (24px) to allow the true-black background to act as a natural separator. Inside cards, internal padding is generous (24px) to maintain a premium feel.
- **Responsive:** On mobile, margins scale to 16px and cards stack vertically. The 16px-24px roundedness is maintained even on smaller devices to preserve the shape language.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** and **Low-contrast outlines** rather than blurs or heavy shadows.

- **Layer 0:** Background (#000000).
- **Layer 1:** Primary Surfaces (#1c1c1e). These cards should have a subtle 1px border (#2c2c2e) to define their edges against the black background.
- **Layer 2:** Inset elements (Input fields, secondary nested containers) use a darker tone (#121212) or a slightly lighter tone (#2c2c2e) depending on whether they are interactive or purely structural.

Avoid drop shadows entirely; the contrast between the black background and charcoal cards provides sufficient depth.

## Shapes

The design system adopts a **Rounded (0.5rem - 1.5rem)** shape language to mimic the friendly yet modern "squircle" look found in contemporary hardware-inspired interfaces.

- **Small Components:** Buttons and inputs use 12px-16px corner radii.
- **Cards/Containers:** Main dashboard cards use 24px corner radii for a distinct, modern silhouette.
- **Progress Bars:** Use a pill-shaped (full-round) cap for all bars and sliders to distinguish data visualization from structural UI.

## Components

- **Buttons:** Primary buttons are off-white (#F5F5F5) with black text for maximum visibility. Secondary buttons use the charcoal surface with a light border. Active/Toggle buttons use Neon Green.
- **Cards:** Defined by #1c1c1e fill and a subtle #2c2c2e border. Content within cards is separated by whitespace rather than dividers.
- **Progress Bars:** Background track is #2c2c2e; the fill is #00e676. No shadows.
- **Input Fields:** Darker inset surfaces (#121212) with 16px corner radius. Focused state features a 1px Neon Green border.
- **Chips/Badges:** Small, high-radius (pill) indicators. Use Neon Green for "Active" or "On Track" and Charcoal for "Scheduled" or "Neutral."
- **Charts:** Bar charts should use the Primary Neon Green for active data series, set against the dark card surfaces for high visual pop.