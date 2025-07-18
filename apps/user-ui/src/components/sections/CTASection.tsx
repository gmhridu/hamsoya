import { Button } from '../ui/button';
import { ArrowRight, Sparkles, Gift, Zap } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 lg:py-24">
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-8 lg:p-16 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Floating icons */}
        <div className="absolute top-8 right-8 text-white/20 animate-bounce">
          <Gift className="w-8 h-8" />
        </div>
        <div className="absolute bottom-8 left-8 text-white/20 animate-pulse">
          <Zap className="w-6 h-6" />
        </div>
        <div className="absolute top-1/4 left-1/4 text-white/20 animate-ping">
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="relative z-10 text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Limited Time Offer
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-[800] mb-6 font-sora leading-tight">
            Ready to Start Your{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Shopping Journey?
            </span>
          </h2>

          {/* Description */}
          <p className="text-blue-100 text-lg lg:text-xl max-w-3xl mx-auto mb-12 font-urbanist leading-relaxed">
            Join thousands of satisfied customers and discover amazing products at unbeatable prices. 
            Start shopping today and experience the difference!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-base backdrop-blur-sm transition-all duration-300"
            >
              Browse Categories
            </Button>
          </div>

          {/* Special Offers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-2xl font-bold mb-2 font-sora">Free Shipping</div>
              <div className="text-blue-100 text-sm font-urbanist">On orders over $50</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-2xl font-bold mb-2 font-sora">30-Day Returns</div>
              <div className="text-blue-100 text-sm font-urbanist">Hassle-free returns</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-2xl font-bold mb-2 font-sora">24/7 Support</div>
              <div className="text-blue-100 text-sm font-urbanist">Always here to help</div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl lg:text-3xl font-[800] text-gray-900 mb-4 font-sora">
            Stay Updated with Latest Deals
          </h3>
          <p className="text-gray-600 mb-8 font-urbanist">
            Subscribe to our newsletter and be the first to know about new products, exclusive offers, and special discounts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-urbanist"
            />
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold whitespace-nowrap"
            >
              Subscribe
            </Button>
          </div>
          
          <p className="text-gray-500 text-sm mt-4 font-urbanist">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
