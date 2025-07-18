import {
  Facebook,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const productCategories = [
    { name: 'Ayurvedic Medicines', href: '/ayurvedic' },
    { name: 'Herbal Supplements', href: '/supplements' },
    { name: 'Spice Blends', href: '/spices' },
    { name: 'Raw Honey', href: '/honey' },
    { name: 'Wellness Teas', href: '/teas' },
    { name: 'Essential Oils', href: '/oils' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/story' },
    { name: 'Quality Promise', href: '/quality' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Track Order', href: '/track' },
    { name: 'FAQ', href: '/faq' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: '#',
      color: 'hover:text-blue-600',
    },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    {
      name: 'Instagram',
      icon: Instagram,
      href: '#',
      color: 'hover:text-pink-600',
    },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
  ];

  return (
    <footer className="bg-gradient-to-br from-brand-dark to-brand-primary text-white">
      {/* Main Footer Content */}
      <div className="px-40 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Hamsoya Logo"
                width={48}
                height={24}
                className="object-contain"
              />
              <h3 className="text-2xl font-bold font-sora">Hamsoya</h3>
            </div>

            <p className="text-brand-light/80 leading-relaxed font-urbanist max-w-md">
              Your trusted partner in natural wellness. We bring you authentic
              Ayurvedic products, traditional spice blends, and pure honey
              sourced with care and crafted with love.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-brand-accent" />
                </div>
                <span className="text-brand-light/90">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-brand-accent" />
                </div>
                <span className="text-brand-light/90">hello@hamsoya.com</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 text-brand-accent" />
                </div>
                <span className="text-brand-light/90">
                  123 Wellness Street, Ayurveda District,
                  <br />
                  Mumbai, Maharashtra 400001
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-brand-primary/20 rounded-lg flex items-center justify-center text-brand-accent transition-colors duration-300 ${social.color}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-sora">Products</h4>
            <ul className="space-y-3">
              {productCategories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-brand-light/80 hover:text-brand-accent transition-colors duration-300 font-urbanist"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-sora">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-brand-light/80 hover:text-brand-accent transition-colors duration-300 font-urbanist"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-sora">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-brand-light/80 hover:text-brand-accent transition-colors duration-300 font-urbanist"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-brand-light/20">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2 text-brand-accent">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-medium">100% Natural</span>
            </div>
            <div className="flex items-center gap-2 text-brand-accent">
              <div className="w-5 h-5 bg-brand-accent/20 rounded flex items-center justify-center">
                <span className="text-xs font-bold">✓</span>
              </div>
              <span className="text-sm font-medium">USDA Certified</span>
            </div>
            <div className="flex items-center gap-2 text-brand-accent">
              <div className="w-5 h-5 bg-brand-accent/20 rounded flex items-center justify-center">
                <span className="text-xs font-bold">ISO</span>
              </div>
              <span className="text-sm font-medium">ISO Certified</span>
            </div>
            <div className="flex items-center gap-2 text-brand-accent">
              <div className="w-5 h-5 bg-brand-accent/20 rounded flex items-center justify-center">
                <span className="text-xs font-bold">★</span>
              </div>
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-light/20 px-40 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-brand-light/70 text-sm font-urbanist">
            © 2024 Hamsoya. All rights reserved. Made with ❤️ for your wellness.
          </div>

          <div className="flex flex-wrap gap-6">
            {legalLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-brand-light/70 hover:text-brand-accent text-sm transition-colors duration-300 font-urbanist"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
