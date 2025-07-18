import { ArrowRight, Heart, Leaf, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Container } from '../layout';
import { Button } from '../ui/button';

const ProductCategoriesSection = () => {
  const categories = [
    {
      id: 'health',
      title: 'Health Products',
      description:
        'Premium health supplements and natural wellness solutions for your daily needs',
      image: '/hero-product.svg',
      bgColor: 'bg-gradient-to-br from-brand-primary/10 to-brand-primary/5',
      borderColor: 'border-brand-primary/20',
      textColor: 'text-brand-primary',
      buttonColor: 'bg-brand-primary hover:bg-brand-primary-dark',
      icon: Leaf,
      features: ['Premium Quality', 'Natural Ingredients', 'Lab Tested'],
      productCount: '150+ Products',
    },
    {
      id: 'spices',
      title: 'Spice Blends',
      description:
        'Authentic spice blends and seasonings that bring traditional flavors to your kitchen',
      image: '/hero-product.svg',
      bgColor: 'bg-gradient-to-br from-brand-secondary/10 to-brand-secondary/5',
      borderColor: 'border-brand-secondary/20',
      textColor: 'text-brand-secondary',
      buttonColor: 'bg-brand-secondary hover:bg-brand-secondary-dark',
      icon: Sparkles,
      features: ['Fresh Ground', 'Premium Quality', 'Traditional Blends'],
      productCount: '80+ Varieties',
    },
    {
      id: 'honey',
      title: 'Natural Honey',
      description:
        'Pure, raw honey varieties sourced directly from trusted beekeepers across regions',
      image: '/hero-product.svg',
      bgColor: 'bg-gradient-to-br from-brand-muted/10 to-brand-muted/5',
      borderColor: 'border-brand-muted/20',
      textColor: 'text-brand-muted',
      buttonColor: 'bg-brand-muted hover:bg-brand-muted-dark',
      icon: Heart,
      features: ['Raw & Unprocessed', 'Single Origin', 'Quality Tested'],
      productCount: '25+ Types',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-brand-accent/5">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-brand-accent/20 border border-brand-primary/20 rounded-full px-4 py-2 text-sm font-medium text-brand-primary mb-6">
          <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
          Our Product Categories
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-6 font-sora">
          Discover Our{' '}
          <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-clip-text text-transparent">
            Premium Collection
          </span>
        </h2>

        <p className="text-brand-muted text-lg lg:text-xl max-w-3xl mx-auto font-urbanist">
          Explore our carefully curated selection of premium health products,
          traditional spice blends, and pure honey varieties - all sourced with
          care and crafted for your modern lifestyle.
        </p>
      </div>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className={`group relative ${category.bgColor} ${category.borderColor} border rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm cursor-pointer`}
              >
                {/* Category Icon */}
                <div
                  className={`w-16 h-16 ${category.textColor} bg-white/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="w-8 h-8" />
                </div>

                {/* Category Content */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-brand-dark font-sora">
                      {category.title}
                    </h3>
                    <span
                      className={`text-xs ${category.textColor} bg-white/60 px-2 py-1 rounded-full font-medium`}
                    >
                      {category.productCount}
                    </span>
                  </div>

                  <p className="text-brand-earth text-sm leading-relaxed font-urbanist">
                    {category.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {category.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 ${category.textColor} rounded-full`}
                        ></div>
                        <span className="text-xs text-brand-earth font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <Image
                    src={category.image}
                    alt={`${category.title} showcase`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ${category.buttonColor} text-white rounded-full font-semibold group-hover:shadow-lg transition-all duration-300`}
                >
                  Explore {category.title.split(' ')[0]}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Decorative elements */}
                <div
                  className={`absolute top-4 right-4 w-8 h-8 ${category.textColor} opacity-10 rounded-full`}
                ></div>
                <div
                  className={`absolute bottom-4 left-4 w-4 h-4 ${category.textColor} opacity-20 rounded-full`}
                ></div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <Button
          size="lg"
          className="bg-brand-secondary hover:bg-brand-secondary-dark text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
        >
          View All Products
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
};

export default ProductCategoriesSection;
