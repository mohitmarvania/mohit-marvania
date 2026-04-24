import PageTransition from '../../components/PageTransition/PageTransition';
import featuredResearch from '../../data/featuredResearch';
import type { FeaturedResearchItem } from '../../data/featuredResearch';
import Footer from '../../components/Footer/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ResearchPage.css';

export default function ResearchPage() {
  return (
    <PageTransition>
      <div className="research-page">
        <div className="research-page__header">
          <h1 className="research-page__title">
            Research<span className="research-page__title-dot">.</span>
          </h1>
        </div>
        
        <div className="research-page__grid">
          {featuredResearch.map((paper: FeaturedResearchItem, idx: number) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link 
                to={`/research/${paper.slug}`}
                className="research-page__card"
                style={{ textDecoration: 'none' }}
              >
              <div className="research-page__card-image-wrapper">
                <img 
                  src={paper.image} 
                  alt={paper.title} 
                  className="research-page__card-image"
                />
              </div>
              <div className="research-page__card-info">
                {paper.statusTag && (
                  <div className={`global-status-pill color-${paper.statusTag.color}`} style={{ marginBottom: '16px' }}>
                    <div className="status-dot" />
                    {paper.statusTag.text}
                  </div>
                )}
                <div className="research-page__card-meta">
                  {paper.labels.map((label: string, i: number) => (
                    <span key={i} className="research-page__card-venue">{label}</span>
                  ))}
                </div>
                <h3 className="research-page__card-title">{paper.title}</h3>
                <p className="research-page__card-authors">{paper.description}</p>
                
                <div className="research-page__card-bottom">
                  <div className="research-page__card-tags">
                    {paper.stats.map((stat, i) => (
                      <span key={i} className="research-page__card-tag">{stat.label}</span>
                    ))}
                  </div>
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="research-page__coming-soon"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>More research coming soon...</span>
        </motion.div>
      </div>
      
      {/* We reuse the Footer at the bottom of the Research page too */}
      <Footer />
    </PageTransition>
  );
}
