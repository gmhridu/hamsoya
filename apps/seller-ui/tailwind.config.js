/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: 'var(--font-sora)',
        urbanist: 'var(--font-urbanist)',
        'space-grotesk': 'var(--font-space-grotesk)',
      },
      spacing: {
        40: '10rem', // 160px
        'container-x': '160px', // Exact 160px for consistent horizontal spacing
        'layout-x': '160px', // Exact 160px - Alternative name for layout consistency
        160: '160px', // Direct 160px utility
      },
      colors: {
        // Modern Ecommerce Brand Colors
        brand: {
          // Primary colors extracted from Hamsoya logo
          primary: '#1E3A8A', // Logo blue - main brand color for headers and CTAs
          secondary: '#D4AF37', // Logo gold - accent color for highlights and important elements
          accent: '#F4C2A1', // Logo skin tone - warm accent for special elements

          // Supporting colors from logo
          dark: '#000000', // Logo black - text and strong contrast elements
          light: '#FFFFFF', // Logo white - backgrounds and clean areas
          muted: '#6B7280', // Medium gray - secondary text and borders

          // Tonal variations for better design flexibility
          'primary-dark': '#1E40AF', // Darker blue for hover states
          'primary-light': '#3B82F6', // Lighter blue for backgrounds
          'secondary-dark': '#B45309', // Darker gold for emphasis
          'secondary-light': '#F59E0B', // Lighter gold for subtle elements
          'accent-dark': '#E5B887', // Darker accent for borders
          'accent-light': '#F8E5D3', // Lighter accent for backgrounds
          'muted-dark': '#4B5563', // Darker muted for emphasis
          'muted-light': '#9CA3AF', // Lighter muted for subtle text
        },

        // Ayurvedic Brand Colors - Earth Tones & Natural Palette (preserved for legacy)
        ayurvedic: {
          // Primary greens - representing nature and healing
          primary: '#2D5016', // Deep forest green
          'primary-light': '#4A7C59', // Medium forest green
          'primary-lighter': '#6B8E23', // Olive green

          // Secondary earth tones
          earth: '#8B4513', // Saddle brown
          'earth-light': '#CD853F', // Peru brown
          'earth-lighter': '#DEB887', // Burlywood

          // Accent colors
          gold: '#DAA520', // Goldenrod
          'gold-light': '#F4A460', // Sandy brown
          honey: '#FFA500', // Orange (honey color)

          // Natural greens
          sage: '#9CAF88', // Sage green
          mint: '#98FB98', // Pale green
          leaf: '#228B22', // Forest green

          // Neutral earth tones
          sand: '#F5E6D3', // Light sand
          cream: '#FFF8DC', // Cornsilk
          stone: '#A0A0A0', // Gray

          // Status colors with natural feel
          success: '#32CD32', // Lime green
          warning: '#FF8C00', // Dark orange
          error: '#DC143C', // Crimson
        },

        // Spice colors for spice mix products (using modern brand colors)
        spice: {
          turmeric: '#C7A528', // Using brand secondary gold for turmeric
          paprika: '#CC6600', // Paprika red-orange
          cumin: '#6B7280', // Using brand muted for cumin
          cardamom: '#F5F5F5', // Using brand accent for cardamom
          cinnamon: '#D2691E', // Cinnamon
          saffron: '#E6C547', // Using brand secondary-light for saffron
        },

        // Honey product colors (using modern brand colors)
        honey: {
          raw: '#C7A528', // Using brand secondary gold for raw honey
          golden: '#E6C547', // Using brand secondary-light for golden honey
          dark: '#A68B1F', // Using brand secondary-dark for dark honey
          amber: '#C7A528', // Using brand secondary for amber honey
        },

        // Functional colors (preserved from previous configuration)
        'primary-bg': '#ECECEC',
        'search-primary': '#693AF8',
        'search-light': '#693AF80D',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
