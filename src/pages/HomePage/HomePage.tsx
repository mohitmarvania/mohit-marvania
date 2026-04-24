import HeroSection from '../../components/HeroSection/HeroSection';
import StatementBlock from '../../components/StatementBlock/StatementBlock';
import FeaturedResearch from '../../components/FeaturedResearch/FeaturedResearch';
import Footer from '../../components/Footer/Footer';
import PageTransition from '../../components/PageTransition/PageTransition';
import { Link } from 'react-router-dom';

interface HomePageProps {
  showContent: boolean;
}

export default function HomePage({ showContent }: HomePageProps) {
  return (
    <PageTransition>
      <HeroSection visible={showContent} />
      <StatementBlock />
      <FeaturedResearch />

      {/* CTA — naturally placed after the featured research scroll */}
      <section className="featured-research__cta-section">
        <Link to="/research" className="featured-research__cta-btn">
          <span className="featured-research__cta-text">Explore all research</span>
          <span className="featured-research__cta-arrow">→</span>
        </Link>
      </section>

      <Footer />
    </PageTransition>
  );
}
