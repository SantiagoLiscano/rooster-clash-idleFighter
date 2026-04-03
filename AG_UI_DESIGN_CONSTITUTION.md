# High-Level UI Designer Constitution: Rooster Clash

This document establishes the fundamental principles, aesthetic standards, and technical workflow for the UI/UX design of Rooster Clash. All future developments must adhere to these rules to maintain a premium, cohesive, and "Editorial-meets-Gaming" experience.

---

## 1. The Creative North Star: "The Pastoral Scholar"

The interface is not just a game; it is a **Living Field Journal**. It should feel like high-grade parchment met with modern data visualization.

### Core Aesthetic Pillars:

- **Intentional Asymmetry**: Avoid rigid grids. Use slight offsets to create a human, bespoke feel.
- **Tonal Layering**: Depth is communicated via subtle background shifts, not heavy borders or harsh shadows.
- **Landscape Oriented Canvas**: Treat the screen as a canvas that invites browsing rather than just clicking.

---

## 2. Visual Primitives (from "Mobile Rooster Stats")

### Color Palette

- **Primary (`#703210`)**: Brand moments and active states.
- **Surface/Base (`#fef9ef`)**: The "Parchment". All interactions start here.
- **Secondary (`#7a5900`)**: Specialized data (Levels, Gold, Rewards).
- **Tertiary (`#2c4c24`)**: Success/Growth indicators (XP, Health).

### The "No-Line" Rule

**STRICT PROHIBITION**: Do not use 1px solid borders to section content.

- Achieve separation through background shifts (e.g., `surface` vs `surface-container-low`).
- Use **Vertical Whitespace** as the primary tool for grouping.

### The "Glass & Gradient" Rule

- **Gradients**: Subtle linear transitions from `primary` to `primary_container` for primary actions.
- **Glassmorphism**: Use for overlays (70% opacity, 12-20px backdrop-blur).

---

## 3. Typography Hierarchy

- **The Voice (Newsreader - Serif)**: Character names, section headers, display text. Suggests calligraphic elegance.
- **The Engine (Manrope - Sans-Serif)**: Stats, technical data, body copy. Provides sharp, functional contrast.

---

## 4. UI Component Standards

### Cards & Data

- **Layout**: Horizontal bias. Multi-column stat arrangement.
- **Stat Bars**: Architectural look. Use `surface-container-high` track with `tertiary` fill. Avoid full rounded ends (use `sm` radius).
- **Ambient Shadows**: Sparingly used. 30px blur, 0px offset, 6% opacity tinted with `on-surface`.

### Interactive Elements

- **Buttons**:
  - **Primary**: Rounded `lg` (1rem), High contrast.
  - **Pills/Chips**: Fully rounded (`9999px`) to stand out from squared card structures.
- **Inputs**: Minimalist. No bounding box. Bottom-border only, highlighting on focus.

---

## 5. Stitch Workflow Integration

To maintain this high-level design, we use **Stitch** as our design laboratory:

1.  **Exploration**: New features must first be conceptualized as screens in the **"Mobile Rooster Stats"** Stitch project.
2.  **Refinement**: Use `edit_screens` and `generate_variants` in Stitch to stress-test the "Pastoral Scholar" aesthetic before implementation.
3.  **Tokenization**: Ensure all CSS variables in `src/styles/main.css` align with the `designTheme` tokens fetched from Stitch.
4.  **Consistency**: Before committing code, verify that the implementation matches the high-quality screenshots and metadata generated in Stitch.

---

## 6. Mandatory "Do's & Don'ts"

### Do:

- [ ] Provide at least **16px of breathing room** (padding) in all containers.
- [ ] Use `on_surface_variant` for labels and `on_surface` for values.
- [ ] Allow subtle overlaps or overflows for a "bespoke" feel.

### Don't:

- [ ] **NEVER** use pure black (`#000000`). Use weighted surface tones.
- [ ] **Avoid Icon Overload**. Rely on elegant typography and color first.
- [ ] **No "Extra-Large" (XL) rounding** on cards. Keep it refined (MD/0.75rem).

---

> [!IMPORTANT]
> This document is the "Source of Truth" for any UI change. If a proposed design looks "basic" or "template-like," it has failed the constitution.
