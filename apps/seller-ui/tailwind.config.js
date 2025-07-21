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
  			'space-grotesk': 'var(--font-space-grotesk)'
  		},
  		spacing: {
  			'40': '10rem',
  			'160': '160px',
  			'container-x': '160px',
  			'layout-x': '160px'
  		},
  		colors: {
  			brand: {
  				primary: '#1E3A8A',
  				secondary: '#D4AF37',
  				accent: '#F4C2A1',
  				dark: '#000000',
  				light: '#FFFFFF',
  				muted: '#6B7280',
  				'primary-dark': '#1E40AF',
  				'primary-light': '#3B82F6',
  				'secondary-dark': '#B45309',
  				'secondary-light': '#F59E0B',
  				'accent-dark': '#E5B887',
  				'accent-light': '#F8E5D3',
  				'muted-dark': '#4B5563',
  				'muted-light': '#9CA3AF'
  			},
  			ayurvedic: {
  				primary: '#2D5016',
  				'primary-light': '#4A7C59',
  				'primary-lighter': '#6B8E23',
  				earth: '#8B4513',
  				'earth-light': '#CD853F',
  				'earth-lighter': '#DEB887',
  				gold: '#DAA520',
  				'gold-light': '#F4A460',
  				honey: '#FFA500',
  				sage: '#9CAF88',
  				mint: '#98FB98',
  				leaf: '#228B22',
  				sand: '#F5E6D3',
  				cream: '#FFF8DC',
  				stone: '#A0A0A0',
  				success: '#32CD32',
  				warning: '#FF8C00',
  				error: '#DC143C'
  			},
  			spice: {
  				turmeric: '#C7A528',
  				paprika: '#CC6600',
  				cumin: '#6B7280',
  				cardamom: '#F5F5F5',
  				cinnamon: '#D2691E',
  				saffron: '#E6C547'
  			},
  			honey: {
  				raw: '#C7A528',
  				golden: '#E6C547',
  				dark: '#A68B1F',
  				amber: '#C7A528'
  			},
  			'primary-bg': '#ECECEC',
  			'search-primary': '#693AF8',
  			'search-light': '#693AF80D',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
};
