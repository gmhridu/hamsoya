import { CreditCard, Headphones, Shield, Star, Truck, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Shopping',
      description:
        'Your data and payments are protected with enterprise-grade security and encryption.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description:
        'Get your orders delivered quickly with our reliable shipping partners worldwide.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description:
        'Multiple payment options including cards, digital wallets, and buy now pay later.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description:
        'Our dedicated customer support team is available round the clock to help you.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description:
        'All products are carefully curated and tested to ensure the highest quality standards.',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'Experience blazing fast website performance and instant search results.',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <section className="py-20 lg:py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-6">
          <Star className="w-4 h-4" />
          Why Choose Us
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[800] text-gray-900 mb-6 font-sora">
          Experience the{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Best Shopping
          </span>{' '}
          Journey
        </h2>

        <p className="text-gray-600 text-lg lg:text-xl max-w-3xl mx-auto font-urbanist">
          We&apos;ve designed every aspect of our platform to provide you with
          an exceptional shopping experience that&apos;s secure, fast, and
          enjoyable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 font-sora">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed font-urbanist">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Trust Section */}
      <div className="mt-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-[800] text-blue-600 font-sora">
              10K+
            </div>
            <div className="text-gray-600 font-medium font-urbanist">
              Happy Customers
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-[800] text-purple-600 font-sora">
              50K+
            </div>
            <div className="text-gray-600 font-medium font-urbanist">
              Products Sold
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-[800] text-green-600 font-sora">
              99.9%
            </div>
            <div className="text-gray-600 font-medium font-urbanist">
              Uptime
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-[800] text-orange-600 font-sora">
              24/7
            </div>
            <div className="text-gray-600 font-medium font-urbanist">
              Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
