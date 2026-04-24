import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClock } from '../../hooks/useClock';
import './Navbar.css';

interface NavbarProps {
  visible: boolean;
}

export default function Navbar({ visible }: NavbarProps) {
  const time = useClock();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Only hide after scrolling past the navbar height threshold
      if (currentY > 80) {
        setHidden(currentY > lastScrollY.current); // scrolling down → hide
      } else {
        setHidden(false); // Always show near the top
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${visible ? 'visible' : ''} ${hidden ? 'navbar-hidden' : ''}`} id="navbar">
      <Link to="/" className="navbar-brand">MOHIT MARVANIA</Link>
      <div className="navbar-center">
        Fairfax, VA — {time} EST
      </div>
      <nav className="navbar-links">
        <Link to="/research" className="navbar-link" id="nav-research">RESEARCH</Link>
        <Link to="/about" className="navbar-link" id="nav-about">ABOUT</Link>
        <a
          href="/Mohit_Marvania_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-resume"
          id="nav-resume"
        >
          RESUME
        </a>
      </nav>
    </header>
  );
}
