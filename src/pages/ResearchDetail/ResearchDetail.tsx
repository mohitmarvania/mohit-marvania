import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition';
import featuredResearch from '../../data/featuredResearch';
import Footer from '../../components/Footer/Footer';
import './ResearchDetail.css';

export default function ResearchDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Find current project
  const currentIndex = featuredResearch.findIndex(p => p.slug === slug);
  const project = featuredResearch[currentIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <PageTransition>
        <div className="detail-not-found">
          <h1>Research Not Found</h1>
          <button onClick={() => navigate('/research')}>Go Back</button>
        </div>
      </PageTransition>
    );
  }

  // Calculate Previous & Next Projects (circular)
  const nextIndex = (currentIndex + 1) % featuredResearch.length;
  const prevIndex = (currentIndex - 1 + featuredResearch.length) % featuredResearch.length;
  const nextProject = featuredResearch[nextIndex];
  const prevProject = featuredResearch[prevIndex];

  return (
    <PageTransition>
      <article className="research-detail">
        
        {/* ─── 01. HERO COVER ─── */}
        <section className="detail-hero">
          {project.coverImage && (
            <motion.img 
              src={project.coverImage} 
              alt={project.title} 
              className="detail-hero-img"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </section>

        {/* ─── 02. MEGA TITLE & META ─── */}
        <section className="detail-header-block">
          
          {/* Status Tag injected above title */}
          {project.statusTag && (
            <motion.div 
              className={`global-status-pill color-${project.statusTag.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="status-dot" />
              {project.statusTag.text}
            </motion.div>
          )}

          <motion.h1 
            className="detail-mega-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {project.title}
          </motion.h1>

          {project.metaData && (
            <motion.div 
              className="detail-meta-grid"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {project.metaData.map((meta, idx) => (
                <div key={idx} className="meta-item">
                  <span className="meta-label">{meta.label}</span>
                  <span className="meta-value">{meta.value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </section>

        {/* ─── 03. EDITORIAL BODY ─── */}
        <section className="detail-editorial">
          
          <div className="editorial-overview">
            <motion.p 
              className="editorial-overview-text"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {project.overview}
            </motion.p>
          </div>

          {project.contentSections?.map((section) => (
            <div key={section.id} className="editorial-section">
              {/* Sticky Sidebar */}
              <div className="editorial-left">
                <div className="editorial-sticky">
                  <h3 className="editorial-section-title">{section.title}</h3>
                </div>
              </div>
              
              {/* Flowing Text Content */}
              <div className="editorial-right">
                {section.paragraphs.map((para, pIdx) => (
                  <motion.p 
                    key={pIdx} 
                    className="editorial-paragraph"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                  >
                    {para}
                  </motion.p>
                ))}

                {/* Optional embedded diagram/image for this section */}
                {section.image && (
                  <motion.img 
                    src={section.image} 
                    alt={`Visualization for ${section.title}`} 
                    className="editorial-inline-image"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ─── 04. PREV / NEXT NAVIGATION ─── */}
        <section className="detail-nav-block">
          <Link to={`/research/${prevProject.slug}`} className="nav-project-link nav-prev">
            <motion.div 
              className="nav-project-inner"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="nav-arrow nav-arrow-prev">←</span>
              <span className="nav-label">PREVIOUS</span>
              <h2 className="nav-title">{prevProject.title}</h2>
            </motion.div>
          </Link>

          <div className="nav-divider" />

          <Link to={`/research/${nextProject.slug}`} className="nav-project-link nav-next">
            <motion.div 
              className="nav-project-inner"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="nav-arrow nav-arrow-next">→</span>
              <span className="nav-label">NEXT</span>
              <h2 className="nav-title">{nextProject.title}</h2>
            </motion.div>
          </Link>
        </section>

      </article>

      <Footer />
    </PageTransition>
  );
}
