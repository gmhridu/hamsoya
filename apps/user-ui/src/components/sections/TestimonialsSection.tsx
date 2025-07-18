import { Quote, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      company: 'TechCorp',
      content:
        'Amazing shopping experience! The product quality exceeded my expectations and the delivery was super fast. Highly recommend this platform.',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      name: 'Michael Chen',
      role: 'Software Developer',
      company: 'StartupXYZ',
      content:
        'Great customer service and excellent product selection. The website is easy to navigate and the checkout process is seamless.',
      rating: 5,
      avatar: '👨‍💻',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Designer',
      company: 'Creative Studio',
      content:
        'Love the variety of products available. Found exactly what I was looking for at competitive prices. Will definitely shop here again!',
      rating: 5,
      avatar: '👩‍🎨',
    },
    {
      name: 'David Thompson',
      role: 'Business Owner',
      company: 'Local Business',
      content:
        'Outstanding quality and service. The team goes above and beyond to ensure customer satisfaction. Five stars!',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      name: 'Lisa Wang',
      role: 'Product Manager',
      company: 'Innovation Labs',
      content:
        'Impressed by the fast shipping and secure packaging. The products arrived in perfect condition. Excellent experience overall.',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      name: 'James Wilson',
      role: 'Entrepreneur',
      company: 'Wilson Ventures',
      content:
        'Best online shopping platform I&apos;ve used. Great prices, quality products, and fantastic customer support. Highly recommended!',
      rating: 5,
      avatar: '👨‍💼',
    },
  ];

  return (
    <section className="py-20 lg:py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 text-sm font-medium text-yellow-700 mb-6">
          <Star className="w-4 h-4" />
          Customer Reviews
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[800] text-gray-900 mb-6 font-sora">
          What Our{' '}
          <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Customers
          </span>{' '}
          Say About Us
        </h2>

        <p className="text-gray-600 text-lg lg:text-xl max-w-3xl mx-auto font-urbanist">
          Don&apos;t just take our word for it. Here&apos;s what our satisfied
          customers have to say about their shopping experience with us.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Quote icon */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Quote className="w-12 h-12 text-gray-400" />
            </div>

            <CardContent className="p-6">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6 font-urbanist">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900 font-sora">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 font-urbanist">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Stats */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <div className="text-3xl lg:text-4xl font-[800] text-blue-600 font-sora">
              4.9/5
            </div>
            <div className="text-gray-600 font-medium font-urbanist">
              Average Rating
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-[800] text-purple-600 font-sora">
              10,000+
            </div>
            <div className="text-gray-600 font-medium font-urbanist">
              Customer Reviews
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-[800] text-green-600 font-sora">
              98%
            </div>
            <div className="text-gray-600 font-medium font-urbanist">
              Satisfaction Rate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
