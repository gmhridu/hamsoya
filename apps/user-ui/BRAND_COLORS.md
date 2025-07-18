# Authentic Logo Brand Colors

This document outlines the brand color system extracted from our actual logo.png file and integrated into the Tailwind CSS configuration.

## Logo-Extracted Colors

The following colors were extracted directly from our Ayurvedic ecommerce platform logo:

### Primary Brand Colors
- **Gold/Brown Primary**: `#967911` - Main brand color representing premium quality and natural products
- **Blue Secondary**: `#00489a` - Trust, reliability, and professionalism
- **Light Gold/Cream Accent**: `#fedc92` - Warmth, premium feel, and natural elegance

### Supporting Colors
- **Earth Tone**: `#88836d` - Natural, grounding, represents organic products
- **Black**: `#000000` - Contrast, elegance, and sophistication
- **White**: `#ffffff` - Purity, cleanliness, and simplicity

## Tailwind CSS Usage

### Brand Color Classes
```css
/* Primary brand colors */
bg-brand-primary        /* #967911 - Gold/brown */
bg-brand-secondary      /* #00489a - Blue */
bg-brand-accent         /* #fedc92 - Light gold/cream */

/* Supporting colors */
bg-brand-earth          /* #88836d - Muted green/brown */
bg-brand-dark           /* #000000 - Black */
bg-brand-light          /* #ffffff - White */

/* Tonal variations */
bg-brand-primary-dark   /* Darker gold for hover states */
bg-brand-primary-light  /* Lighter gold for backgrounds */
bg-brand-secondary-dark /* Darker blue for emphasis */
bg-brand-secondary-light /* Lighter blue for subtle elements */
```

### Product-Specific Colors (Harmonized with Logo)
```css
/* Spice colors using logo palette */
bg-spice-turmeric       /* #967911 - Logo primary gold */
bg-spice-cumin          /* #88836d - Logo earth tone */
bg-spice-cardamom       /* #fedc92 - Logo accent cream */
bg-spice-saffron        /* #b8941a - Logo primary-light */

/* Honey colors using logo palette */
bg-honey-raw            /* #967911 - Logo primary gold */
bg-honey-golden         /* #fedc92 - Logo accent cream */
bg-honey-dark           /* #7a5f0e - Logo primary-dark */
bg-honey-amber          /* #b8941a - Logo primary-light */
```

### Functional Colors (Preserved)
```css
bg-primary-bg           /* #ECECEC - Main background */
bg-search-primary       /* #693AF8 - Search button */
bg-search-light         /* #693AF80D - Search state */
```

## Design Guidelines

### Color Hierarchy
1. **Primary**: Use `brand-primary` (#967911) for main CTAs, headers, and key brand elements
2. **Secondary**: Use `brand-secondary` (#00489a) for secondary actions and trust indicators
3. **Accent**: Use `brand-accent` (#fedc92) for highlights, backgrounds, and warm touches
4. **Earth**: Use `brand-earth` (#88836d) for natural product categories and grounding elements

### Accessibility Considerations
- Primary gold (#967911) provides good contrast on white backgrounds
- Blue secondary (#00489a) meets WCAG AA standards for text
- Always test color combinations for sufficient contrast ratios
- Use white text on dark brand colors, black text on light brand colors

### Usage Examples
```jsx
// Primary CTA button
<button className="bg-brand-primary text-white hover:bg-brand-primary-dark">
  Shop Now
</button>

// Secondary action
<button className="bg-brand-secondary text-white hover:bg-brand-secondary-dark">
  Learn More
</button>

// Product category card
<div className="bg-brand-accent text-brand-dark border border-brand-earth">
  Ayurvedic Spices
</div>

// Trust indicator
<div className="bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
  Certified Organic
</div>
```

## Integration with shadcn/ui

The CSS variables in `global.css` have been updated to use the authentic logo colors:
- Primary components now use the gold/brown tone from the logo
- Secondary components use the blue tone from the logo
- Accent colors use the light gold/cream tone from the logo

This ensures that all shadcn/ui components automatically reflect our authentic brand colors.

## Migration Notes

- Legacy `ayurvedic.*` color classes are preserved for backward compatibility
- New `brand.*` classes should be used for all new components
- Spice and honey color palettes have been harmonized with logo colors
- All functional colors (search, background) remain unchanged
