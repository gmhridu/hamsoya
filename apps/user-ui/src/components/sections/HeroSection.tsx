'use client';

import { ArrowRight, Clock, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Container } from '../layout/Container';
import { Button } from '../ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSection = () => {
  // Sample product data for the slider
  const featuredProducts = [
    {
      id: 1,
      title: 'Premium Organic Honey',
      price: 899,
      originalPrice: 1199,
      image: '/hero-product.svg',
      badge: 'Best Seller',
      rating: 4.8,
      reviews: 234,
      isPreOrder: false,
    },
    {
      id: 2,
      title: 'Traditional Spice Blend Set',
      price: 1299,
      originalPrice: 1599,
      image: '/hero-product.svg',
      badge: 'Pre-Order',
      rating: 4.9,
      reviews: 156,
      isPreOrder: true,
      availableDate: 'Ships in 5 days',
    },
    {
      id: 3,
      title: 'Health Supplement Bundle',
      price: 2499,
      originalPrice: 2999,
      image: '/hero-product.svg',
      badge: 'Limited Edition',
      rating: 4.7,
      reviews: 89,
      isPreOrder: false,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-accent to-white">
      <Container>
        <div className="py-12 lg:py-20">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-2 text-sm font-medium text-brand-primary mb-6">
              <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
              Featured Products
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-4 font-sora">
              Discover Our{' '}
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Best Sellers
              </span>
            </h1>
            <p className="text-brand-muted text-lg max-w-2xl mx-auto font-urbanist">
              Shop our most popular products with exclusive deals and fast
              shipping
            </p>
          </div>

          {/* Product Slider */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination',
              }}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="product-slider"
            >
              {featuredProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    {/* Product Image */}
                    <div className="relative mb-6 overflow-hidden rounded-2xl">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge */}
                      <div
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                          product.badge === 'Pre-Order'
                            ? 'bg-brand-secondary'
                            : product.badge === 'Best Seller'
                            ? 'bg-brand-primary'
                            : 'bg-brand-muted'
                        }`}
                      >
                        {product.badge}
                      </div>

                      {/* Discount */}
                      {product.originalPrice > product.price && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100
                          )}
                          % OFF
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors font-sora">
                        {product.title}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-brand-muted">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-brand-primary">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-lg text-brand-muted line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Pre-order info */}
                      {product.isPreOrder && (
                        <div className="flex items-center gap-2 text-brand-secondary text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{product.availableDate}</span>
                        </div>
                      )}

                      {/* CTA Button */}
                      <Button
                        className={`w-full ${
                          product.isPreOrder
                            ? 'bg-brand-secondary hover:bg-brand-secondary-dark'
                            : 'bg-brand-primary hover:bg-brand-primary-dark'
                        } text-white rounded-full font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 group`}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.isPreOrder ? 'Pre-Order Now' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button className="swiper-button-prev w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-brand-primary-dark transition-colors">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>

              <div className="swiper-pagination flex gap-2"></div>

              <button className="swiper-button-next w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-brand-primary-dark transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-brand-secondary hover:bg-brand-secondary-dark text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
