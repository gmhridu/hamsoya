import { Container } from '../components/layout';
import Footer from '../components/layout/Footer';
import {
  NewsletterCTASection,
  PreOrderSpotlightSection,
  ProductCategoriesSection,
  SocialProofSection,
  WhyChooseUsSection,
} from '../components/sections';
import HeroSlider from '../components/sections/HeroSlider';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Hero Slider - Full width professional ecommerce slider */}
      <HeroSlider />

      {/* Product Categories Grid */}
      <ProductCategoriesSection />

      {/* Pre-Order Spotlight */}
      <PreOrderSpotlightSection />

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* Social Proof */}
        <SocialProofSection />


      {/* Newsletter/CTA Section */}
      <Container>
        <NewsletterCTASection />
      </Container>

      {/* Footer */}
      <Footer />
    </main>
  );
}
