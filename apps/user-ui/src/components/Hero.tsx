import Image from 'next/image';
import { Button } from './ui/button';

const Hero = () => {
  return (
    <div className="py-5">
      <section className="relative w-full overflow-hidden min-h-[80vh]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/herobg.svg"
            alt="Hero Background"
            fill
            className="object-cover w-full h-full"
            priority={true}
          />
        </div>

        {/* Content Container with 160px margins and proper vertical spacing */}
        <div className="relative mx-40 h-full flex items-center z-10 py-24">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl xl:text-6xl font-[800] leading-tight text-[#0F0E0E]">
                  Don&apos;t Miss Out on These{' '}
                  <span className="block text-[#4D5DE9]">
                    Unbeatable Black Friday Deals!
                  </span>
                </h1>

                <p className="text-[#666666] text-lg leading-relaxed max-w-lg">
                  Save big this Black Friday with unbeatable deals on tech, home
                  essentials, fashion, and more! Limited stock.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-[#4D5DE9] hover:bg-[#3D4DD9] text-white px-8 py-4 rounded-full font-semibold text-base"
                >
                  Buy Now
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  className="text-[#333333] hover:bg-gray-50 px-8 py-4 font-semibold text-base"
                >
                  All Products
                </Button>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[550px]">
                <Image
                  src="/hero-product.svg"
                  alt="Black Friday Deal - Premium Headphones"
                  width={800}
                  height={800}
                  className="w-full h-auto object-contain"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
