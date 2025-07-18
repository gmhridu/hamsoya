'use client';

import { ArrowRight, Bell, CheckCircle, Gift, Mail } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const NewsletterCTASection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  const benefits = [
    {
      icon: Gift,
      title: 'Exclusive Offers',
      description:
        'Get 20% off your first order and access to member-only deals',
    },
    {
      icon: Bell,
      title: 'Early Access',
      description:
        'Be the first to know about new products and pre-order opportunities',
    },
    {
      icon: Mail,
      title: 'Shopping Tips',
      description: 'Receive expert product advice and shopping tips weekly',
    },
  ];

  return (
    <section className="py-20 lg:py-24">
      {/* Main Newsletter Section */}
      <div className="relative overflow-hidden rounded-3xl mb-16">
        {/* Gradient Background with blur filter effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6925] to-[#FFF] opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#4D5DE9] to-transparent opacity-70 backdrop-blur-sm"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-8 lg:p-16 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-sm font-medium text-white mb-6">
              <Mail className="w-4 h-4" />
              Join Our Shopping Community
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 font-sora">
              Stay Updated with{' '}
              <span className="bg-gradient-to-r from-brand-accent to-white bg-clip-text text-transparent">
                Premium Products
              </span>
            </h2>

            <p className="text-white/90 text-lg lg:text-xl mb-8 font-urbanist max-w-2xl mx-auto">
              Subscribe to our newsletter and get exclusive access to premium
              health products, shopping tips, and special offers delivered to
              your inbox.
            </p>

            {/* Newsletter Form */}
            {!isSubscribed ? (
              <form
                onSubmit={handleSubscribe}
                className="max-w-md mx-auto mb-8"
              >
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/90 backdrop-blur-sm border-white/30 text-brand-dark placeholder:text-brand-earth/70 rounded-full px-6 py-3"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="max-w-md mx-auto mb-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4">
                <div className="flex items-center justify-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    Successfully subscribed!
                  </span>
                </div>
              </div>
            )}

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Unsubscribe anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>50,000+ subscribers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          return (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm border border-brand-accent/20 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <IconComponent className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 font-sora">
                {benefit.title}
              </h3>
              <p className="text-brand-earth font-urbanist">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Secondary CTA Section */}
      <div className="bg-gradient-to-br from-brand-accent/10 to-brand-primary/5 rounded-3xl p-8 lg:p-12 text-center">
        <h3 className="text-2xl lg:text-3xl font-bold text-brand-dark mb-4 font-sora">
          Ready to Start Your Shopping Journey?
        </h3>
        <p className="text-brand-muted text-lg mb-8 font-urbanist max-w-2xl mx-auto">
          Explore our premium collection of health products, traditional spice
          blends, and pure honey varieties. Begin your shopping journey today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-brand-primary hover:bg-brand-primary-dark text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            Shop All Products
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-2 border-brand-secondary hover:border-brand-secondary-dark text-brand-secondary hover:text-brand-secondary-dark px-8 py-4 rounded-full font-semibold bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
          >
            Learn About Products
          </Button>
        </div>

        {/* Additional trust elements */}
        <div className="mt-8 pt-8 border-t border-brand-accent/20">
          <div className="flex flex-wrap justify-center items-center gap-8 text-brand-earth text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
              <span>Free shipping on orders over ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTASection;
