import { ArrowRight, Check, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

const BenefitsSection = () => {
  const benefits = [
    'Premium quality products from trusted brands',
    'Competitive prices with regular discounts',
    'Fast and reliable worldwide shipping',
    'Easy returns and exchange policy',
    'Secure payment processing',
    'Expert customer support team',
  ];

  return (
    <section className="py-20 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-full px-4 py-2 text-sm font-medium text-purple-700">
              <Sparkles className="w-4 h-4" />
              Benefits & Advantages
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[800] text-gray-900 leading-tight font-sora">
              Why Thousands of{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Customers
              </span>{' '}
              Choose Us
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed font-urbanist">
              Join our growing community of satisfied customers who trust us for
              their shopping needs. We&apos;re committed to providing
              exceptional value and service that exceeds expectations.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-200">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium font-urbanist group-hover:text-gray-900 transition-colors">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Start Shopping Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="relative">
          {/* Background decorative elements */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-2xl"></div>

          {/* Main content area */}
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl">
            {/* Product showcase grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/hero-product.svg"
                    alt="Product 1"
                    width={200}
                    height={200}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 text-white">
                  <div className="text-2xl font-bold">50%</div>
                  <div className="text-sm opacity-90">Off Today</div>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
                  <div className="text-sm opacity-90">Free Shipping</div>
                  <div className="text-lg font-bold">Worldwide</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/hero-product.svg"
                    alt="Product 2"
                    width={200}
                    height={200}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              New Arrival!
            </div>
            <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Limited Time
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
