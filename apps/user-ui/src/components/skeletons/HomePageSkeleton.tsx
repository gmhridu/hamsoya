'use client';

import React from 'react';
import { Container } from '../layout';
import { Skeleton } from '../ui/skeleton';

interface HomePageSkeletonProps {
  className?: string;
}

/**
 * Professional home page skeleton loader that matches the exact layout structure
 * Uses shadcn/ui Skeleton component with proper shimmer animations
 * Eliminates white screen flashes during authentication flows and page transitions
 */
export const HomePageSkeleton: React.FC<HomePageSkeletonProps> = ({
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-primary-bg ${className}`}>
      {/* Header Skeleton - matches Header component exactly */}
      <HeaderSkeleton />

      <main>
        {/* Hero Slider Skeleton - matches HeroSlider component */}
        <HeroSliderSkeleton />

        {/* Product Categories Skeleton - matches ProductCategoriesSection */}
        <ProductCategoriesSkeleton />

        {/* Pre-Order Spotlight Skeleton - matches PreOrderSpotlightSection */}
        <PreOrderSpotlightSkeleton />

        {/* Why Choose Us Skeleton - matches WhyChooseUsSection */}
        <WhyChooseUsSkeleton />

        {/* Social Proof Skeleton - matches SocialProofSection */}
        <SocialProofSkeleton />

        {/* Newsletter CTA Skeleton - matches NewsletterCTASection */}
        <NewsletterCTASkeleton />
      </main>

      {/* Footer Skeleton - matches Footer component */}
      <FooterSkeleton />
    </div>
  );
};

/**
 * Header skeleton that matches the exact Header component structure
 * Includes logo, search bar, navigation icons, and user button area
 */
const HeaderSkeleton: React.FC = () => {
  return (
    <header className="border-b border-brand-muted/20 bg-white shadow-sm font-sora">
      <Container className="py-3">
        <div className="flex items-center justify-between">
          {/* Logo Skeleton */}
          <div className="flex items-center flex-shrink-0 gap-3">
            <Skeleton className="h-[36px] w-[59px]" />
            <Skeleton className="h-6 w-20 hidden sm:block" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="flex-1 max-w-2xl mx-2 md:mx-4">
            <div className="flex items-center bg-white border border-brand-muted/20 rounded-full overflow-hidden shadow-sm">
              {/* Category Dropdown Skeleton */}
              <div className="hidden md:block pl-1">
                <Skeleton className="h-10 w-24 rounded-full" />
              </div>

              {/* Search Input Skeleton */}
              <div className="flex-1 px-4 py-3">
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Search Button Skeleton */}
              <div className="absolute right-1">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Side Icons Skeleton */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Wishlist Icon Skeleton */}
            <Skeleton className="h-10 w-10 rounded-full" />

            {/* Cart Icon Skeleton */}
            <Skeleton className="h-10 w-10 rounded-full" />

            {/* Auth State Manager Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16 rounded-full hidden sm:block" />
              <Skeleton className="h-8 w-16 rounded-full hidden sm:block" />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

/**
 * Hero Slider skeleton that matches the full-screen hero section
 * Matches the exact dimensions and layout of HeroSlider component with product imagery
 */
const HeroSliderSkeleton: React.FC = () => {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px] overflow-hidden">
      {/* Background with brand gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700" />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Main content layout */}
      <div className="relative h-full">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left side - Text content */}
            <div className="space-y-6 text-center lg:text-left">
              {/* Badge skeleton */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
                <Skeleton className="w-4 h-4 bg-white/30" />
                <Skeleton className="h-4 w-24 bg-white/30" />
              </div>

              {/* Subtitle skeleton */}
              <Skeleton className="h-6 w-48 bg-white/25" />

              {/* Main title skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-12 lg:h-16 w-full max-w-lg bg-white/30" />
                <Skeleton className="h-12 lg:h-16 w-4/5 max-w-md bg-white/25" />
              </div>

              {/* Description skeleton */}
              <div className="space-y-2 max-w-2xl">
                <Skeleton className="h-5 w-full bg-white/20" />
                <Skeleton className="h-5 w-5/6 bg-white/20" />
              </div>

              {/* Discount badge skeleton */}
              <div className="inline-flex items-center gap-2 bg-brand-secondary/80 rounded-full px-6 py-3">
                <Skeleton className="w-5 h-5 bg-brand-dark/30" />
                <Skeleton className="h-5 w-20 bg-brand-dark/30" />
              </div>

              {/* CTA buttons skeleton */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Skeleton className="h-14 w-52 rounded-full bg-white/30" />
                <Skeleton className="h-14 w-36 rounded-full bg-white/20" />
              </div>

              {/* Trust indicators skeleton */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded-full bg-white/25" />
                    <Skeleton className="h-4 w-20 bg-white/20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Product image/visual */}
            <div className="relative flex items-center justify-center">
              {/* Main product image skeleton */}
              <div className="relative">
                {/* Background circle for product */}
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  {/* Product container skeleton */}
                  <div className="w-48 h-64 lg:w-56 lg:h-72 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30 flex flex-col items-center justify-center space-y-4">
                    {/* Product label area */}
                    <div className="w-32 h-20 bg-white/30 rounded-xl"></div>

                    {/* Product details */}
                    <div className="w-8 h-8 bg-white/40 rounded-full"></div>

                    {/* Premium badge */}
                    <div className="w-28 h-6 bg-white/50 rounded-full"></div>
                  </div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute -top-4 -left-4 w-6 h-6 bg-brand-accent/60 rounded-full animate-pulse"></div>
                <div
                  className="absolute -top-4 -right-4 w-6 h-6 bg-brand-accent/60 rounded-full animate-pulse"
                  style={{ animationDelay: '0.5s' }}
                ></div>
                <div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-brand-secondary/60 rounded-full animate-pulse"
                  style={{ animationDelay: '1s' }}
                ></div>

                {/* Additional floating elements */}
                <div
                  className="absolute top-1/4 -left-8 w-4 h-4 bg-white/40 rounded-full animate-pulse"
                  style={{ animationDelay: '1.5s' }}
                ></div>
                <div
                  className="absolute bottom-1/4 -right-8 w-4 h-4 bg-white/40 rounded-full animate-pulse"
                  style={{ animationDelay: '2s' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows skeleton */}
      <div className="hero-navigation">
        <Skeleton className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20" />
        <Skeleton className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20" />
      </div>

      {/* Navigation dots skeleton */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="hero-pagination flex gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 rounded-full bg-white/40" />
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Product Categories skeleton that matches the exact grid layout
 * Matches ProductCategoriesSection component structure
 */
const ProductCategoriesSkeleton: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-brand-accent/5">
      {/* Section header skeleton */}
      <div className="text-center mb-16">
        {/* Badge skeleton */}
        <div className="inline-flex items-center gap-2 bg-brand-accent/20 border border-brand-primary/20 rounded-full px-4 py-2 mb-6">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-4 mb-6">
          <Skeleton className="h-12 w-96 mx-auto" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-80 mx-auto" />
          <Skeleton className="h-5 w-72 mx-auto" />
        </div>
      </div>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="group relative bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border border-brand-primary/20 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500"
            >
              {/* Category icon skeleton */}
              <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mb-6">
                <Skeleton className="w-8 h-8" />
              </div>

              {/* Category content skeleton */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>

                {/* Description skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                {/* Features skeleton */}
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="w-1.5 h-1.5 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA button skeleton */}
              <Skeleton className="h-12 w-full rounded-full" />

              {/* Product image skeleton */}
              <div className="absolute -top-4 -right-4 opacity-20">
                <Skeleton className="w-20 h-20 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/**
 * Pre-Order Spotlight skeleton that matches PreOrderSpotlightSection
 * Includes product showcase with pricing and features
 */
const PreOrderSpotlightSkeleton: React.FC = () => {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        {/* Section header skeleton */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-secondary/20 border border-brand-secondary/30 rounded-full px-4 py-2 mb-6">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="space-y-4 mb-6">
            <Skeleton className="h-12 w-80 mx-auto" />
            <Skeleton className="h-12 w-72 mx-auto" />
          </div>

          <Skeleton className="h-5 w-96 mx-auto" />
        </div>

        {/* Product spotlight card */}
        <div className="bg-gradient-to-br from-brand-accent/10 to-brand-secondary/5 border border-brand-accent/20 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content skeleton */}
            <div className="space-y-6">
              {/* Category badge */}
              <Skeleton className="h-6 w-20 rounded-full" />

              {/* Product title */}
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-4/5" />
              </div>

              {/* Rating and reviews */}
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-5 h-5" />
                  ))}
                </div>
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Features list */}
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>

              {/* Availability info */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* CTA buttons */}
              <div className="flex gap-4">
                <Skeleton className="h-12 w-40 rounded-full" />
                <Skeleton className="h-12 w-32 rounded-full" />
              </div>
            </div>

            {/* Product image skeleton */}
            <div className="relative">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-brand-accent/20">
                <Skeleton className="w-full h-80 rounded-2xl" />

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                </div>
                <div className="absolute -bottom-4 -left-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

/**
 * Why Choose Us skeleton that matches WhyChooseUsSection
 * Includes trust factors grid and stats section
 */
const WhyChooseUsSkeleton: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-brand-accent/5">
      <Container>
        {/* Section header skeleton */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-primary/20 border border-brand-primary/30 rounded-full px-4 py-2 mb-6">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="space-y-4 mb-6">
            <Skeleton className="h-12 w-80 mx-auto" />
            <Skeleton className="h-12 w-72 mx-auto" />
          </div>

          <Skeleton className="h-5 w-96 mx-auto" />
        </div>

        {/* Trust factors grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="group bg-brand-secondary/10 border border-brand-secondary/20 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500"
            >
              {/* Icon skeleton */}
              <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mb-6">
                <Skeleton className="w-8 h-8" />
              </div>

              {/* Title skeleton */}
              <Skeleton className="h-7 w-40 mb-4" />

              {/* Description skeleton */}
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Features list skeleton */}
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats section skeleton */}
        <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Skeleton className="w-8 h-8" />
                </div>
                <Skeleton className="h-10 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

/**
 * Social Proof skeleton that matches SocialProofSection
 * Includes featured testimonial and reviews grid
 */
const SocialProofSkeleton: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-brand-accent/5 to-white">
      <Container>
        {/* Section header skeleton */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-accent/20 border border-brand-accent/30 rounded-full px-4 py-2 mb-6">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="space-y-4 mb-6">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-12 w-80 mx-auto" />
          </div>

          <Skeleton className="h-5 w-88 mx-auto" />
        </div>

        {/* Featured testimonial skeleton */}
        <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-3xl p-8 lg:p-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Rating skeleton */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-6 h-6" />
              ))}
            </div>

            {/* Quote skeleton */}
            <div className="space-y-4 mb-8">
              <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
              <Skeleton className="h-6 w-5/6 mx-auto" />
              <Skeleton className="h-6 w-4/5 mx-auto" />
            </div>

            {/* User info skeleton */}
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="text-left space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-3 h-3 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Trust badges skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm border border-brand-accent/20 rounded-2xl p-6 text-center"
            >
              <Skeleton className="h-8 w-8 mx-auto mb-3" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          ))}
        </div>

        {/* All reviews grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm border border-brand-accent/20 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Rating skeleton */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="w-4 h-4" />
                ))}
              </div>

              {/* Review text skeleton */}
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Product info skeleton */}
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>

              {/* User info skeleton */}
              <div className="flex items-center gap-3 pt-4 border-t border-brand-accent/20">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/**
 * Newsletter CTA skeleton that matches NewsletterCTASection
 * Includes main newsletter section, benefits grid, and secondary CTA
 */
const NewsletterCTASkeleton: React.FC = () => {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        {/* Main Newsletter Section skeleton */}
        <div className="relative overflow-hidden rounded-3xl mb-16">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6925] to-[#FFF] opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#4D5DE9] to-transparent opacity-70 backdrop-blur-sm"></div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 p-8 lg:p-16 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Badge skeleton */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                <Skeleton className="w-4 h-4 bg-white/30" />
                <Skeleton className="h-4 w-32 bg-white/30" />
              </div>

              {/* Heading skeleton */}
              <div className="space-y-4 mb-6">
                <Skeleton className="h-12 w-96 mx-auto bg-white/30" />
                <Skeleton className="h-12 w-80 mx-auto bg-white/25" />
              </div>

              {/* Description skeleton */}
              <div className="space-y-2 mb-8">
                <Skeleton className="h-5 w-full max-w-2xl mx-auto bg-white/20" />
                <Skeleton className="h-5 w-4/5 mx-auto bg-white/20" />
              </div>

              {/* Newsletter form skeleton */}
              <div className="max-w-md mx-auto mb-8">
                <div className="flex gap-3">
                  <Skeleton className="flex-1 h-12 rounded-full bg-white/30" />
                  <Skeleton className="h-12 w-28 rounded-full bg-white/40" />
                </div>
              </div>

              {/* Trust indicators skeleton */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full bg-white/25" />
                    <Skeleton className="h-4 w-24 bg-white/20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm border border-brand-accent/20 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Skeleton className="w-8 h-8" />
              </div>
              <Skeleton className="h-6 w-32 mx-auto mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Secondary CTA Section skeleton */}
        <div className="bg-gradient-to-br from-brand-accent/10 to-brand-primary/5 rounded-3xl p-8 lg:p-12 text-center">
          <Skeleton className="h-8 w-80 mx-auto mb-4" />
          <div className="space-y-2 mb-8">
            <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-5 w-4/5 mx-auto" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-44 rounded-full" />
          </div>

          {/* Trust elements skeleton */}
          <div className="pt-8 border-t border-brand-accent/20">
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

/**
 * Footer skeleton that matches the exact Footer component structure
 * Includes brand section, contact info, social links, and bottom bar
 */
const FooterSkeleton: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-brand-dark to-brand-primary text-white">
      {/* Main Footer Content */}
      <div className="px-40 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand Section skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-6 bg-white/20" />
              <Skeleton className="h-8 w-24 bg-white/20" />
            </div>

            <div className="space-y-2 max-w-md">
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-5/6 bg-white/20" />
              <Skeleton className="h-4 w-4/5 bg-white/20" />
            </div>

            {/* Contact Info skeleton */}
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                    <Skeleton className="w-4 h-4 bg-white/30" />
                  </div>
                  <Skeleton className="h-4 w-32 bg-white/20" />
                </div>
              ))}
            </div>

            {/* Social Links skeleton */}
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-brand-primary/20 rounded-lg flex items-center justify-center"
                >
                  <Skeleton className="w-5 h-5 bg-white/30" />
                </div>
              ))}
            </div>
          </div>

          {/* Links columns skeleton */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-24 bg-white/20" />
              <div className="space-y-3">
                {[...Array(6)].map((_, j) => (
                  <Skeleton key={j} className="h-4 w-20 bg-white/20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar skeleton */}
      <div className="border-t border-brand-light/20 px-40 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Skeleton className="h-4 w-64 bg-white/20" />

          <div className="flex flex-wrap gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-16 bg-white/20" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomePageSkeleton;
