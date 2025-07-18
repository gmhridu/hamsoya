import React from 'react';
import { Button } from './ui/button';

/**
 * Demo component showcasing the authentic logo brand colors
 * This component demonstrates how to use the new brand color palette
 * extracted from the actual logo.png file
 */
const BrandColorDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">
          Authentic Logo Brand Colors
        </h1>
        <p className="text-brand-earth">
          Colors extracted directly from our logo.png file
        </p>
      </div>

      {/* Primary Brand Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-dark">Primary Brand Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-brand-primary text-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Primary Gold</h3>
            <p className="text-sm opacity-90">#967911</p>
            <p className="text-xs mt-2">Main brand color for CTAs and headers</p>
          </div>
          <div className="bg-brand-secondary text-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Secondary Blue</h3>
            <p className="text-sm opacity-90">#00489a</p>
            <p className="text-xs mt-2">Trust and reliability indicators</p>
          </div>
          <div className="bg-brand-accent text-brand-dark p-6 rounded-lg border border-brand-earth">
            <h3 className="font-semibold mb-2">Accent Cream</h3>
            <p className="text-sm opacity-75">#fedc92</p>
            <p className="text-xs mt-2">Warm highlights and backgrounds</p>
          </div>
        </div>
      </section>

      {/* Supporting Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-dark">Supporting Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-brand-earth text-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Earth Tone</h3>
            <p className="text-sm opacity-90">#88836d</p>
            <p className="text-xs mt-2">Natural and grounding elements</p>
          </div>
          <div className="bg-brand-dark text-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Brand Black</h3>
            <p className="text-sm opacity-90">#000000</p>
            <p className="text-xs mt-2">Contrast and elegance</p>
          </div>
          <div className="bg-brand-light text-brand-dark p-6 rounded-lg border border-brand-earth">
            <h3 className="font-semibold mb-2">Brand White</h3>
            <p className="text-sm opacity-75">#ffffff</p>
            <p className="text-xs mt-2">Purity and cleanliness</p>
          </div>
        </div>
      </section>

      {/* Product Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-dark">Product Colors (Harmonized)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-spice-turmeric text-white p-4 rounded-lg text-center">
            <h4 className="font-medium">Turmeric</h4>
            <p className="text-xs opacity-90">Spice</p>
          </div>
          <div className="bg-spice-cumin text-white p-4 rounded-lg text-center">
            <h4 className="font-medium">Cumin</h4>
            <p className="text-xs opacity-90">Spice</p>
          </div>
          <div className="bg-honey-raw text-white p-4 rounded-lg text-center">
            <h4 className="font-medium">Raw Honey</h4>
            <p className="text-xs opacity-90">Honey</p>
          </div>
          <div className="bg-honey-golden text-brand-dark p-4 rounded-lg text-center border border-brand-earth">
            <h4 className="font-medium">Golden Honey</h4>
            <p className="text-xs opacity-75">Honey</p>
          </div>
        </div>
      </section>

      {/* Button Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-dark">Button Examples</h2>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-brand-primary hover:bg-brand-primary-dark">
            Primary CTA
          </Button>
          <Button className="bg-brand-secondary hover:bg-brand-secondary-dark">
            Secondary Action
          </Button>
          <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
            Outlined
          </Button>
          <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent-dark">
            Accent Button
          </Button>
        </div>
      </section>

      {/* shadcn/ui Components with New Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-dark">shadcn/ui Components</h2>
        <p className="text-brand-earth text-sm">
          These components automatically use the new brand colors through CSS variables:
        </p>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>
    </div>
  );
};

export default BrandColorDemo;
