import Image from 'next/image';
import { Button } from './ui/button';

const ProductShowcase = () => {
  const products = [
    {
      id: 1,
      title: 'Trendy Products',
      image: '/hero-product.svg',
      hasButton: true,
      buttonText: 'Buy Now',
      gradient: 'from-[#4D5DE9] to-[#8B5CF6]',
    },
    {
      id: 2,
      title: 'Logitech Gaming Headphone',
      price: '$150.99',
      originalPrice: '$175.99',
      image: '/hero-product.svg',
      hasButton: false,
    },
    {
      id: 3,
      title: 'Good Quality 100 Men Sun Glass',
      price: '$100.99',
      originalPrice: '$125.99',
      image: '/hero-product.svg',
      hasButton: false,
    },
    {
      id: 4,
      title: 'Best Bags For The Kids',
      price: '$50.99',
      originalPrice: '$75.99',
      image: '/hero-product.svg',
      hasButton: false,
    },
  ];

  return (
    <section className="w-full py-16 bg-[#ECECEC]">
      {/* Content Container with 160px margins */}
      <div className="mx-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`relative rounded-3xl overflow-hidden ${
                product.hasButton
                  ? `bg-gradient-to-br ${product.gradient} text-white`
                  : 'bg-white'
              } p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              {/* Product Image */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Product Content */}
              <div className="text-center space-y-4">
                <h3
                  className={`text-lg font-bold ${
                    product.hasButton ? 'text-white' : 'text-[#0F0E0E]'
                  }`}
                >
                  {product.title}
                </h3>

                {product.price && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl font-bold text-[#0F0E0E]">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {product.hasButton && (
                  <Button className="w-full bg-white text-[#4D5DE9] hover:bg-gray-100 font-semibold py-3 rounded-full">
                    {product.buttonText}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
