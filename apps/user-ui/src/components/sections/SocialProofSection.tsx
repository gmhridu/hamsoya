'use client';

import { ChevronLeft, ChevronRight, Quote, Star, Verified } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Container } from '../layout';
import { Button } from '../ui/button';

const SocialProofSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      text: 'The health supplement has completely transformed my energy levels. I feel more vibrant and focused throughout the day. The quality is exceptional and the packaging ensures freshness.',
      product: 'Health Supplement',
      category: 'Health',
      verified: true,
      avatar: '/hero-product.png',
      purchaseDate: '3 months ago',
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Delhi, NCR',
      rating: 5,
      text: "Their garam masala blend is authentic and aromatic. It brings the traditional taste to my cooking that I remember from my grandmother's kitchen. Highly recommended!",
      product: 'Organic Garam Masala',
      category: 'Spice Mix',
      verified: true,
      avatar: '/hero-product.png',
      purchaseDate: '2 months ago',
    },
    {
      id: 3,
      name: 'Anita Patel',
      location: 'Ahmedabad, Gujarat',
      rating: 5,
      text: 'The wild forest honey is pure and delicious. You can taste the difference in quality. My family loves it and we use it daily. Great for health and taste.',
      product: 'Wild Forest Honey',
      category: 'Honey',
      verified: true,
      avatar: '/hero-product.png',
      purchaseDate: '1 month ago',
    },
    {
      id: 4,
      name: 'Dr. Meera Nair',
      location: 'Kochi, Kerala',
      rating: 5,
      text: 'As a health practitioner, I recommend these products to my patients. The quality and authenticity are outstanding. The traditional preparation methods are well maintained.',
      product: 'Health Collection',
      category: 'Health',
      verified: true,
      avatar: '/hero-product.svg',
      purchaseDate: '6 months ago',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      location: 'Jaipur, Rajasthan',
      rating: 5,
      text: 'Fast delivery and excellent packaging. The turmeric powder is fresh and potent. I can see the difference in color and aroma compared to store-bought ones.',
      product: 'Organic Turmeric Powder',
      category: 'Spice Mix',
      verified: true,
      avatar: '/hero-product.svg',
      purchaseDate: '2 weeks ago',
    },
  ];

  const trustBadges = [
    { label: '50,000+ Happy Customers', icon: '👥' },
    { label: '4.9/5 Average Rating', icon: '⭐' },
    { label: '99% Positive Reviews', icon: '💯' },
    { label: 'Certified Organic', icon: '🌿' },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const currentReview = testimonials[currentTestimonial];

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-brand-accent/5 to-white">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-2 text-sm font-medium text-brand-primary mb-6">
          <Star className="w-4 h-4 fill-current" />
          Customer Reviews
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-6 font-sora">
          What Our{' '}
          <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-clip-text text-transparent">
            Customers Say
          </span>
        </h2>

        <p className="text-brand-earth text-lg lg:text-xl max-w-3xl mx-auto font-urbanist">
          Real experiences from real customers who have transformed their
          wellness journey with our products.
        </p>
      </div>

      {/* Main Testimonial */}
      <Container>
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm border border-brand-accent/30 rounded-3xl p-8 lg:p-12 shadow-xl">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <Quote className="w-8 h-8 text-brand-primary" />
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              {[...Array(currentReview.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-yellow-400 fill-current"
                />
              ))}
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-xl lg:text-2xl text-brand-dark text-center leading-relaxed mb-8 font-urbanist">
              &ldquo;{currentReview.text}&rdquo;
            </blockquote>

            {/* Customer Info */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-accent">
                <Image
                  src={currentReview.avatar}
                  alt={currentReview.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center">
                  <h4 className="font-bold text-brand-dark font-sora">
                    {currentReview.name}
                  </h4>
                  {currentReview.verified && (
                    <Verified className="w-4 h-4 text-brand-secondary" />
                  )}
                </div>
                <p className="text-brand-earth text-sm">
                  {currentReview.location}
                </p>
                <p className="text-brand-primary text-xs font-medium">
                  Purchased {currentReview.product} •{' '}
                  {currentReview.purchaseDate}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full border-brand-primary/20 hover:bg-brand-primary/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-brand-primary w-6'
                        : 'bg-brand-primary/30'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full border-brand-primary/20 hover:bg-brand-primary/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Trust Badges */}
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm border border-brand-accent/20 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="font-semibold text-brand-dark text-sm font-sora">
                {badge.label}
              </div>
            </div>
          ))}
        </div>

        {/* All Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/60 backdrop-blur-sm border border-brand-accent/20 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-brand-earth text-sm leading-relaxed mb-4 font-urbanist">
                &ldquo;{testimonial.text.substring(0, 120)}...&rdquo;
              </p>

              {/* Customer */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-accent">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h5 className="font-semibold text-brand-dark text-sm font-sora">
                      {testimonial.name}
                    </h5>
                    {testimonial.verified && (
                      <Verified className="w-3 h-3 text-brand-secondary" />
                    )}
                  </div>
                  <p className="text-brand-earth text-xs">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* CTA */}
      <div className="text-center mt-12">
        <Button
          size="lg"
          className="bg-brand-primary hover:bg-brand-primary-dark text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          Read All Reviews
        </Button>
      </div>
    </section>
  );
};

export default SocialProofSection;
