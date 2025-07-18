'use client';

import { ArrowRight, Clock, ShoppingCart, Star } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '../ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSlider = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const heroSlides = [
    {
      id: 1,
      title: 'Premium Health Products',
      subtitle: 'Natural Wellness Solutions',
      description:
        'Discover our curated collection of premium health supplements and natural wellness products for your modern lifestyle.',
      ctaPrimary: 'Shop Health Products',
      ctaSecondary: 'Learn More',
      badge: 'New Arrivals',
      discount: '20% OFF',
      bgGradient: 'from-blue-900 via-blue-800 to-blue-700',
      bgPattern:
        'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    },
    {
      id: 2,
      title: 'Traditional Spice Blends',
      subtitle: 'Authentic Flavors',
      description:
        'Experience the rich taste of traditional spice blends and seasonings that bring authentic flavors to your kitchen.',
      ctaPrimary: 'Shop Spices',
      ctaSecondary: 'View Collection',
      badge: 'Best Sellers',
      discount: '15% OFF',
      bgGradient: 'from-amber-600 via-orange-600 to-yellow-600',
      bgPattern:
        'radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    },
    {
      id: 3,
      title: 'Pure Natural Honey',
      subtitle: 'Raw & Unprocessed',
      description:
        'Pure, raw honey varieties sourced directly from trusted beekeepers across regions for the finest quality.',
      ctaPrimary: 'Shop Honey',
      ctaSecondary: 'Pre-Order Now',
      badge: 'Pre-Order',
      discount: 'Limited Stock',
      bgGradient: 'from-amber-800 via-yellow-700 to-orange-700',
      bgPattern:
        'radial-gradient(circle at 40% 60%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    },
  ];

  useEffect(() => {
    // Custom pagination styling
    const style = document.createElement('style');
    style.textContent = `
      .hero-pagination .swiper-pagination-bullet {
        width: 12px;
        height: 12px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 1;
        margin: 0 6px;
        transition: all 0.3s ease;
      }
      .hero-pagination .swiper-pagination-bullet-active {
        background: #FFFFFF;
        transform: scale(1.2);
      }
      .hero-navigation .swiper-button-next,
      .hero-navigation .swiper-button-prev {
        color: #FFFFFF;
        width: 50px;
        height: 50px;
        margin-top: -25px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        transition: all 0.3s ease;
      }
      .hero-navigation .swiper-button-next:hover,
      .hero-navigation .swiper-button-prev:hover {
        background: rgba(0, 0, 0, 0.5);
        transform: scale(1.1);
      }
      .hero-navigation .swiper-button-next::after,
      .hero-navigation .swiper-button-prev::after {
        font-size: 20px;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.hero-next',
          prevEl: '.hero-prev',
        }}
        pagination={{
          el: '.hero-pagination',
          clickable: true,
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="h-full w-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background */}
              <div className="absolute inset-0">
                {/* Main gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`}
                />
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: slide.bgPattern,
                  }}
                />
                {/* Subtle texture overlay */}
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 lg:px-8">
                  <div className="max-w-4xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-sm font-medium text-white mb-6">
                      <Star className="w-4 h-4" />
                      {slide.badge}
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg lg:text-xl font-medium text-white/90 mb-2 font-urbanist">
                          {slide.subtitle}
                        </h2>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white mb-6 font-sora">
                          {slide.title}
                        </h1>
                      </div>

                      <p className="text-white/90 text-lg lg:text-xl leading-relaxed max-w-2xl font-urbanist">
                        {slide.description}
                      </p>

                      {/* Discount Badge */}
                      <div className="inline-flex items-center gap-2 bg-brand-secondary text-brand-dark px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                        <Clock className="w-5 h-5" />
                        {slide.discount}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                          size="lg"
                          className="bg-white text-brand-primary hover:bg-white/90 px-8 py-4 rounded-full font-semibold text-base shadow-xl hover:shadow-2xl transition-all duration-300 group"
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          {slide.ctaPrimary}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <Button
                          variant="outline"
                          size="lg"
                          className="border-2 border-white/80 text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-base backdrop-blur-sm transition-all duration-300 bg-white/10 shadow-lg hover:shadow-xl hover:border-white"
                        >
                          {slide.ctaSecondary}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation */}
      <div className="hero-navigation">
        <div className="hero-prev absolute left-4 lg:left-8 top-1/2 z-20 cursor-pointer" />
        <div className="hero-next absolute right-4 lg:right-8 top-1/2 z-20 cursor-pointer" />
      </div>

      {/* Pagination */}
      <div className="hero-pagination absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20" />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden lg:block">
        <div className="flex flex-col items-center text-white/70 text-sm">
          <div className="w-px h-16 bg-white/30 mb-2" />
          <span className="rotate-90 whitespace-nowrap">Scroll Down</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
