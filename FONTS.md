# Flow Sports Nutrition - Font Usage Guide

## Font Setup

### Installed Fonts

1. **Poppins** (Google Fonts) - For Headlines
   - Weights: 400, 500, 600, 700, 800 (ExtraBold)
   - Used for: All headings (h1-h6), hero text, section titles
   - Weight used for headings: **800 (ExtraBold)**

2. **Satoshi** (Local Files) - For Body Text
   - Weights: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black)
   - Used for: All body text, paragraphs, descriptions, UI elements

## Usage with Tailwind CSS

### Custom Font Classes

```html
<!-- Headings (Poppins ExtraBold) -->
<h1 class="font-heading">Your Heading</h1>

<!-- Body Text (Satoshi Regular) -->
<p class="font-body">Your body text</p>
```

### Automatic Styling

All `<h1>` through `<h6>` tags automatically use Poppins ExtraBold (weight 800).
All other text automatically uses Satoshi Regular.

### Available Tailwind Font Utilities

#### Font Family
- `font-sans` - Satoshi (body font)
- `font-display` - Poppins (heading font)
- `font-heading` - Poppins ExtraBold (custom utility)
- `font-body` - Satoshi Regular (custom utility)

#### Font Weights (use with appropriate font family)

**Satoshi weights:**
- `font-light` - 300
- `font-normal` - 400
- `font-medium` - 500
- `font-bold` - 700
- `font-black` - 900

**Poppins weights:**
- `font-normal` - 400
- `font-medium` - 500
- `font-semibold` - 600
- `font-bold` - 700
- `font-extrabold` - 800

## Examples

### Hero Section
```vue
<h1 class="text-7xl font-heading">
  FUEL YOUR FLOW STATE
</h1>
<p class="text-xl font-body">
  Premium athletic supplements
</p>
```

### Product Card
```vue
<h3 class="text-2xl font-heading">Flow Energy</h3>
<p class="font-body">Explosive energy for peak performance</p>
```

### Mixed Weights
```vue
<!-- Bold body text -->
<p class="font-body font-bold">Important information</p>

<!-- Medium weight heading -->
<h2 class="font-heading font-medium">Subheading</h2>
```

## Font Files Location

- **Poppins**: Loaded from Google Fonts CDN
- **Satoshi**: `/public/fonts/Satoshi-*.woff` and `.woff2`

## Configuration Files

- Font declarations: `app/assets/styles/fonts.css`
- Global styles: `app/assets/styles/app.css`
- Tailwind theme: `app/assets/styles/app.css` (@theme section)
