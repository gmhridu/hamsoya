import {
  Award,
  CheckCircle,
  Clock,
  Heart,
  Leaf,
  Shield,
  Star,
  Users,
} from 'lucide-react';
import { Container } from '../layout';

const WhyChooseUsSection = () => {
  const trustFactors = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description:
        'Every product undergoes rigorous testing and quality checks to ensure purity and potency.',
      features: ['Quality Tested', 'Premium Standards', 'Customer Approved'],
      bgColor: 'bg-brand-secondary/10',
      iconColor: 'text-brand-secondary',
      borderColor: 'border-brand-secondary/20',
    },
    {
      icon: Leaf,
      title: '100% Natural Products',
      description:
        'Sourced directly from trusted suppliers and traditional producers across regions.',
      features: ['Natural Ingredients', 'No Chemicals', 'Traditional Methods'],
      bgColor: 'bg-brand-primary/10',
      iconColor: 'text-brand-primary',
      borderColor: 'border-brand-primary/20',
    },
    {
      icon: Award,
      title: 'Traditional Quality',
      description:
        'Formulated using time-tested methods and traditional recipes passed down generations.',
      features: [
        'Traditional Recipes',
        'Time-Tested Methods',
        'Expert Formulated',
      ],
      bgColor: 'bg-brand-secondary/10',
      iconColor: 'text-brand-secondary',
      borderColor: 'border-brand-secondary/20',
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description:
        'Join over 50,000 satisfied customers who have experienced the benefits of our products.',
      features: ['50K+ Customers', '4.9 Star Rating', 'Verified Reviews'],
      bgColor: 'bg-brand-muted/10',
      iconColor: 'text-brand-muted',
      borderColor: 'border-brand-muted/20',
    },
    {
      icon: Clock,
      title: 'Fast & Secure Delivery',
      description:
        'Quick delivery with secure packaging to preserve product quality and freshness.',
      features: [
        '2-3 Day Delivery',
        'Secure Packaging',
        'Temperature Controlled',
      ],
      bgColor: 'bg-brand-primary/10',
      iconColor: 'text-brand-primary',
      borderColor: 'border-brand-primary/20',
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description:
        'Dedicated support team to help you choose the right products for your lifestyle.',
      features: ['Expert Guidance', '24/7 Support', 'Product Consultation'],
      bgColor: 'bg-brand-accent/20',
      iconColor: 'text-brand-primary',
      borderColor: 'border-brand-accent/30',
    },
  ];

  const stats = [
    { number: '50,000+', label: 'Happy Customers', icon: Users },
    { number: '500+', label: 'Premium Products', icon: Star },
    { number: '99.9%', label: 'Purity Guarantee', icon: CheckCircle },
    { number: '4.9/5', label: 'Customer Rating', icon: Heart },
  ];

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-brand-light to-brand-accent/10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-brand-secondary/10 border border-brand-secondary/20 rounded-full px-4 py-2 text-sm font-medium text-brand-secondary mb-6">
          <Shield className="w-4 h-4" />
          Trust & Quality
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-6 font-sora">
          Why Choose{' '}
          <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-clip-text text-transparent">
            Our Products
          </span>
        </h2>

        <p className="text-brand-muted text-lg lg:text-xl max-w-3xl mx-auto font-urbanist">
          We are committed to providing the highest quality health products,
          traditional spice blends, and pure honey with complete transparency
          and trust.
        </p>
      </div>

      {/* Trust Factors Grid */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {trustFactors.map((factor, index) => {
            const IconComponent = factor.icon;
            return (
              <div
                key={index}
                className={`group ${factor.bgColor} ${factor.borderColor} border rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 ${factor.iconColor} bg-white/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="w-8 h-8" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-brand-dark font-sora">
                    {factor.title}
                  </h3>

                  <p className="text-brand-earth text-sm leading-relaxed font-urbanist">
                    {factor.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {factor.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle
                          className={`w-4 h-4 ${factor.iconColor}`}
                        />
                        <span className="text-xs text-brand-earth font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative element */}
                <div
                  className={`absolute top-4 right-4 w-8 h-8 ${factor.iconColor} opacity-10 rounded-full`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-brand-primary/5 via-brand-accent/10 to-brand-secondary/5 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-brand-dark mb-4 font-sora">
              Trusted by Customers Nationwide
            </h3>
            <p className="text-brand-earth font-urbanist">
              Our commitment to quality and customer satisfaction speaks for
              itself
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-brand-primary" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-brand-primary mb-2 font-sora">
                    {stat.number}
                  </div>
                  <div className="text-brand-earth font-medium font-urbanist">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUsSection;
