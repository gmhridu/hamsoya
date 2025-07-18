import { Bell, Calendar, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import { Container } from '../layout';
import { Button } from '../ui/button';

const PreOrderSpotlightSection = () => {
  const preOrderProducts = [
    {
      id: 1,
      title: 'Premium Health Supplement',
      description:
        'Pure, quality-tested health supplement sourced from premium regions. Rich in essential nutrients and minerals.',
      image: '/hero-product.svg',
      originalPrice: 2499,
      preOrderPrice: 1999,
      discount: 20,
      availableDate: '2024-08-15',
      category: 'Health',
      categoryColor: 'bg-brand-primary',
      features: ['Quality Tested', 'Premium Source', 'High Grade'],
      estimatedStock: 'Limited to 500 units',
      rating: 4.9,
      preOrderCount: 234,
    },
    {
      id: 2,
      title: 'Organic Garam Masala Blend',
      description:
        'Traditional 12-spice blend crafted by master spice artisans. Perfect for authentic Indian cuisine.',
      image: '/hero-product.svg',
      originalPrice: 899,
      preOrderPrice: 699,
      discount: 22,
      availableDate: '2024-08-20',
      category: 'Spice Mix',
      categoryColor: 'bg-spice-turmeric',
      features: ['12 Premium Spices', 'Artisan Crafted', 'Fresh Ground'],
      estimatedStock: 'Limited to 1000 units',
      rating: 4.8,
      preOrderCount: 156,
    },
    {
      id: 3,
      title: 'Wild Forest Honey Collection',
      description:
        'Rare multi-floral honey from untouched forest regions. Raw, unprocessed, and naturally crystallized.',
      image: '/hero-product.svg',
      originalPrice: 1299,
      preOrderPrice: 999,
      discount: 23,
      availableDate: '2024-08-25',
      category: 'Honey',
      categoryColor: 'bg-honey-raw',
      features: ['Wild Sourced', 'Unprocessed', 'Single Harvest'],
      estimatedStock: 'Limited to 300 units',
      rating: 5.0,
      preOrderCount: 89,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilAvailable = (dateString: string) => {
    const today = new Date();
    const availableDate = new Date(dateString);
    const diffTime = availableDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-brand-accent/5 to-brand-primary/5">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-2 text-sm font-medium text-brand-primary mb-6">
          <Bell className="w-4 h-4 animate-pulse" />
          Pre-Order Exclusive
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-6 font-sora">
          Upcoming{' '}
          <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-clip-text text-transparent">
            Premium Products
          </span>
        </h2>

        <p className="text-brand-earth text-lg lg:text-xl max-w-3xl mx-auto font-urbanist">
          Be the first to experience our latest premium products. Pre-order now
          and enjoy exclusive discounts with guaranteed delivery on launch day.
        </p>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {preOrderProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white/80 backdrop-blur-sm border border-brand-accent/30 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.discount}% OFF
                </div>

                {/* Category Badge */}
                <div
                  className={`absolute top-4 right-4 ${product.categoryColor} text-white px-3 py-1 rounded-full text-xs font-medium`}
                >
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2 font-sora">
                    {product.title}
                  </h3>
                  <p className="text-brand-earth text-sm leading-relaxed font-urbanist">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-brand-accent/20 text-brand-primary px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Rating and Pre-orders */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-brand-dark">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-brand-earth">
                    {product.preOrderCount} pre-orders
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-brand-primary">
                    ₹{product.preOrderPrice}
                  </span>
                  <span className="text-lg text-brand-earth line-through">
                    ₹{product.originalPrice}
                  </span>
                </div>

                {/* Availability Info */}
                <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-brand-primary">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Available: {formatDate(product.availableDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-earth">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {getDaysUntilAvailable(product.availableDate)} days
                      remaining
                    </span>
                  </div>
                  <div className="text-xs text-brand-earth">
                    {product.estimatedStock}
                  </div>
                </div>

                {/* Pre-Order Button */}
                <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white rounded-full font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Pre-Order Now
                  <Bell className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Bottom Info */}
      <div className="mt-16 text-center">
        <div className="bg-white/60 backdrop-blur-sm border border-brand-accent/30 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-brand-dark mb-4 font-sora">
            Pre-Order Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-brand-primary" />
              </div>
              <h4 className="font-semibold text-brand-dark mb-2">
                Exclusive Discounts
              </h4>
              <p className="text-sm text-brand-earth">
                Up to 25% off regular prices
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-brand-secondary" />
              </div>
              <h4 className="font-semibold text-brand-dark mb-2">
                Priority Delivery
              </h4>
              <p className="text-sm text-brand-earth">
                First to receive on launch day
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-brand-primary" />
              </div>
              <h4 className="font-semibold text-brand-dark mb-2">
                No Payment Until Ship
              </h4>
              <p className="text-sm text-brand-earth">
                Reserve now, pay on delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreOrderSpotlightSection;
