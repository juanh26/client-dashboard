---
title: "PulpSense Client Dashboard Design System"
source: "Manual revision from https://www.pulpsense.com/ and Google Stitch project"
source_project: "https://stitch.withgoogle.com/projects/16000462300199319002"
date: "2026-05-18"
status: "canonical"
applies_to:
  - "Next.js App Router"
  - "Tailwind CSS"
  - "shadcn/ui"
  - "Client-facing operational dashboards"
tokens:
  color:
    page:
      value: "#141416"
      usage: "Outer page background and gutters."
    page_rail:
      value: "#202024"
      usage: "Subtle vertical rail/border tone framing the centered app."
    panel:
      value: "#18181b"
      usage: "Default dark panel/card surface."
    panel_elevated:
      value: "#232329"
      usage: "Raised cards, nav pills, table headers, and input surfaces."
    panel_soft:
      value: "#2b2b32"
      usage: "Hover/focus/selected dark surfaces."
    text:
      value: "#f7f7f8"
      usage: "Primary text and logo wordmark."
    text_muted:
      value: "#a1a1aa"
      usage: "Secondary copy and supporting labels."
    text_dim:
      value: "#71717a"
      usage: "Quiet metadata and inactive nav items."
    primary:
      value: "#8067e8"
      usage: "Main PulpSense purple for CTAs, selected states, progress, and dashboard focus."
    primary_light:
      value: "#9b84ff"
      usage: "Highlights, glows, and lighter purple text."
    primary_deep:
      value: "#4f4387"
      usage: "Hero gradient base and deep purple surfaces."
    accent:
      value: "#f59e0b"
      usage: "Small emphasis marks such as the website underline and review accents."
    border:
      value: "#2f2f35"
      usage: "Default panel, table, and control border."
    border_soft:
      value: "rgba(255, 255, 255, 0.08)"
      usage: "Subtle borders on dark gradient areas."
    success:
      value: "#22c55e"
      usage: "Completed states."
    warning:
      value: "#facc15"
      usage: "Client action, review, and caution states."
    error:
      value: "#ef4444"
      usage: "Blocked and destructive states."
  typography:
    primary_font:
      value: "Geist"
      usage: "Primary sans-serif for all dashboard UI."
    mono_font:
      value: "Geist Mono"
      usage: "Only for compact timestamps, tiny metadata, and technical counters."
    scale:
      page_title:
        size: "40-56px desktop, 32px mobile"
        weight: 600
        line_height: 1.05
      section_title:
        size: "20-24px"
        weight: 600
        line_height: 1.25
      body:
        size: "15-16px"
        weight: 400
        line_height: 1.6
      label:
        size: "12-13px"
        weight: 500
        line_height: 1.4
  radius:
    hero: "24px"
    card: "14px"
    control: "999px"
    compact: "10px"
  shadow:
    hero_glow: "0 28px 80px rgba(79, 67, 135, 0.28)"
    card: "0 20px 60px rgba(0, 0, 0, 0.18)"
  layout:
    max_width: "1232px"
    page_padding: "24px mobile, 32px tablet, 40px desktop"
    section_gap: "24px"
---

# PulpSense Client Dashboard Design System

## What Went Wrong In The First Pass

The initial Stitch output was useful for raw tokens, but it overfit a generated token-board artifact instead of the real PulpSense website. The result looked like a generic dark admin table with purple accents. The dashboard must instead inherit the live site composition: centered dark canvas, rounded gradient hero, pill controls, generous but controlled spacing, soft borders, white logo treatment, and a modern high-trust SaaS feel.

## Brand Essence

PulpSense presents itself as a modern automation partner for growing businesses. The interface should feel calm, premium, and operationally sharp. It should not feel like a developer console, a crypto dashboard, or a generic ClickUp skin.

The website's first-screen signals:

- Centered max-width page inside darker side gutters.
- Top nav with white PulpSense logo/wordmark, muted nav links, and a purple pill CTA.
- Large rounded hero panel with dark-to-purple vertical/radial gradient.
- Clean Geist typography with large confident headings and muted supporting text.
- Pill badges and buttons, not sharp technical chips.
- Subtle vertical rails/borders and quiet trust/partner sections below.

## Color System

Use a dark-first palette, but avoid flat black blocks. The page should have layered surfaces and a purple glow/gradient where the website uses it.

| Token            | Value     | Use                                                          |
| ---------------- | --------- | ------------------------------------------------------------ |
| `page`           | `#141416` | Outer app background and side gutters.                       |
| `page-rail`      | `#202024` | Subtle vertical rails framing the content.                   |
| `panel`          | `#18181b` | Standard dashboard cards.                                    |
| `panel-elevated` | `#232329` | Nav pills, table headers, raised cards.                      |
| `panel-soft`     | `#2b2b32` | Hover and active dark surfaces.                              |
| `text`           | `#f7f7f8` | Main text and white logo wordmark.                           |
| `text-muted`     | `#a1a1aa` | Supporting copy.                                             |
| `text-dim`       | `#71717a` | Quiet metadata.                                              |
| `primary`        | `#8067e8` | PulpSense purple for CTAs and progress.                      |
| `primary-light`  | `#9b84ff` | Glow, active highlights, and selected labels.                |
| `primary-deep`   | `#4f4387` | Bottom of hero gradient and deep purple surfaces.            |
| `accent`         | `#f59e0b` | Tiny emphasis marks only, inspired by the website underline. |
| `border`         | `#2f2f35` | Default dark border.                                         |
| `success`        | `#22c55e` | Done/completed states.                                       |
| `warning`        | `#facc15` | Client action/review states.                                 |
| `error`          | `#ef4444` | Blocked states.                                              |

## Typography

Use `Geist` for the whole UI and `Geist Mono` only where metadata benefits from a technical feel. Do not use serif fonts. Do not use oversized hero type inside cards or tables.

- Page title: 40-56px desktop, 32px mobile, 600 weight, tight line height.
- Section title: 20-24px, 600 weight.
- Body: 15-16px, 1.6 line height.
- Labels: 12-13px, medium weight, letter spacing normal or barely increased.
- Mono: timestamps, tiny labels, and compact counters only.

## Layout

The app should feel like a client-facing PulpSense product surface, not a full-width admin template.

- Use a centered content shell with `max-width: 1232px`.
- Keep darker page gutters visible on desktop.
- Use subtle left/right rails around the content area when useful.
- Put the client overview inside a rounded gradient hero panel.
- Put metrics as compact glass cards inside or immediately below the hero, not as disconnected flat blocks.
- Put the work table and action panels below the hero in a balanced 2-column dashboard grid.
- Mobile stacks in this order: brand/header, hero overview, metrics, progress/tasks, client action, blockers.

## Component Direction

### Header

- Use the local PulpSense mark plus white `PulpSense` wordmark.
- Header should be simple and website-like: logo left, optional compact page metadata/status right.
- Prefer pill surfaces and muted metadata, not rectangular technical boxes.

### Hero / Overview

- Use a large rounded panel, radius about 24px.
- Background should echo the website hero: dark top fading into deep purple bottom.
- Include client name, concise explanation, last updated, completion, and key task counts.
- Avoid a marketing headline, but keep the presentation polished and spacious.

### Cards

- Use shadcn/ui `Card`.
- Radius should be 14-16px for cards, 24px for the hero.
- Cards should have dark translucent surfaces, soft borders, and subtle hover changes.
- Avoid hard grid boxes that look like database widgets.

### Buttons / Pills / Badges

- Use pill radius for primary actions and status chips.
- Primary purple fill should feel like the website CTA.
- Badges should be legible and soft: tinted background, colored text, low-contrast border.

### Tables

- Tables should be secondary to the executive overview.
- Keep rows clean and scannable with comfortable row height.
- Use muted headers and soft row borders.
- Long task names and summaries must wrap.
- Do not expose raw ClickUp IDs or implementation details.

### Progress

- Progress should be visually prominent in the hero and repeated in detail only if useful.
- Use purple fill over a dark muted track.
- Display completion as a clear percentage and completed count.

### Empty / Action Panels

- Use shadcn `Empty`, `Item`, and `Card` components.
- Action panels should look like polished client notes, not warning boxes.
- Blocked items should use red sparingly; avoid making the whole page feel broken.

## Status Mapping

- `done`: green text/tint, quiet confidence.
- `in_progress`: purple text/tint.
- `review`: amber text/tint.
- `waiting_client`: amber or purple/amber mixed, clearly action-oriented.
- `blocked`: red text/tint, contained.
- `not_started`: muted grey.

## Do

- Make the dashboard feel like a productized PulpSense client portal.
- Use the website's rounded purple hero language.
- Use white logo treatment in top chrome.
- Keep the dashboard operational and client-safe.
- Use shadcn components as the base.
- Check desktop and mobile visual balance.

## Don't

- Do not make it look like the first dark table implementation.
- Do not use serif fallback fonts.
- Do not overuse monospace.
- Do not make every card black with a thin grey border.
- Do not create decorative orbs or random bokeh.
- Do not use the Stitch token-board visual literally.
- Do not build a landing page; this is still a dashboard.
