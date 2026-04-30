# First Earning Stories - Landing Page Specification

## Project Overview
- **Type**: Single-screen interactive landing page
- **Core**: Guided 4-step conversation about first earning experiences
- **Goal**: Emotional connection through reflection

## Visual Design

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Background | Warm paper beige | #F7F3EF |
| Primary | Muted amber | #E6A96B |
| Secondary | Dusty rose | #D8A7A7 |
| Support | Soft sage | #A8BFA3 |
| Text | Deep charcoal | #2E2E2E |
| Highlight | Warm glow | #F3D7B6 |

### Typography
- **Headings**: Playfair Display (serif) - emotional tone
- **UI Elements**: Inter (sans-serif) - readability
- **Sizes**:
  - Main question: 2.5rem (desktop), 1.75rem (mobile)
  - Buttons: 1rem
  - Subtext: 0.875rem

### Spacing
- Container max-width: 600px
- Button gaps: 12px
- Section padding: 2rem

## Interaction Flow

### Step 1: "Do you remember your first earning?"
- Buttons: "Yes, I do" / "Not really"
- Fade in on load

### Step 2: "How did it feel?"
- Buttons: Proud / Confusing / Happy / Mixed
- Emotion-driven colors for each

### Step 3: "How did you earn it?"
- Buttons: Job / Freelance / Small work / Something else

### Step 4: "Would you like to share it or explore others?"
- Actions: "Write my story" / "Read stories"
- Final CTA buttons

## Background Elements

### Floating Shapes
- 3-4 abstract organic blobs
- Soft blur (filter: blur(60px))
- Colors: muted amber, dusty rose, sage (opacity 15-25%)
- Slow floating animation (20-40s duration)

### Paycheck Illustration
- SVG minimal dollar sign / paycheck icon
- Position: bottom-right area
- Hover: scale up + magnetic pull toward cursor

### Particles
- 8-12 small dots
- Very subtle drift animation
- Opacity: 10-20%

## Animations

### Transitions
- Step change: fade + slide (300ms, ease-out)
- Button hover: translateY(-2px) + shadow (150ms)

### Background
- Cursor parallax: shapes react to mouse position (subtle)
- Idle breathing: scale 1.0-1.02 (8s loop)

### Micro-interactions
- Button hover: lift + color shift
- Touch/click: subtle scale pulse

## Responsive
- Mobile: button text smaller, tighter spacing
- Touch-friendly button sizes (min 44px tap target)

## Constraints
- NO vertical scroll
- NO clutter
- NO bright/neon colors
- Motion must be calm, not chaotic