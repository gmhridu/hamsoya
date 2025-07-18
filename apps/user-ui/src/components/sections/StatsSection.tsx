import { Users, Package, Globe, Award } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: '50,000+',
      label: 'Happy Customers',
      description: 'Satisfied customers worldwide',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Package,
      number: '100,000+',
      label: 'Products Delivered',
      description: 'Successfully delivered orders',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Globe,
      number: '50+',
      label: 'Countries Served',
      description: 'Global shipping coverage',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Award,
      number: '99.9%',
      label: 'Customer Satisfaction',
      description: 'Based on customer reviews',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-20 lg:py-24">
      {/* Background with gradient */}
      <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-16 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 mb-6">
              <Award className="w-4 h-4" />
              Our Achievements
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[800] text-gray-900 mb-6 font-sora">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thousands
              </span>{' '}
              Worldwide
            </h2>
            
            <p className="text-gray-600 text-lg lg:text-xl max-w-3xl mx-auto font-urbanist">
              Our numbers speak for themselves. Join the growing community of satisfied customers 
              who trust us for their shopping needs.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="group text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${stat.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Number */}
                  <div className={`text-4xl lg:text-5xl font-[800] bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 font-sora`}>
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-xl font-bold text-gray-900 mb-2 font-sora">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-gray-600 text-sm font-urbanist">
                    {stat.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-gray-900 font-sora">Join 50,000+ Happy Customers</div>
                <div className="text-gray-600 text-sm font-urbanist">Start your shopping journey today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
