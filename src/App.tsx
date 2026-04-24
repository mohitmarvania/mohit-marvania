import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Navbar from './components/Navbar/Navbar';
import UserCursor from './components/UserCursor/UserCursor';
import AskButton from './components/AskButton/AskButton';

import HomePage from './pages/HomePage/HomePage';
import ResearchPage from './pages/ResearchPage/ResearchPage';
import ResearchDetailPage from './pages/ResearchDetail/ResearchDetail';
import AboutPage from './pages/AboutPage/AboutPage';

import './App.css';

// Resets scroll position on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Inner component to access the router's current location
function AnimatedRoutes({ showContent }: { showContent: boolean }) {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage showContent={showContent} />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/research/:slug" element={<ResearchDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (loadingComplete) {
      // Small delay before showing content for smooth transition
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loadingComplete]);

  return (
    <BrowserRouter>
      <div className="app">
        {/* Loading Screen */}
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />

        {/* Custom Cursor */}
        <UserCursor visible={loadingComplete} />

        {/* Navigation */}
        <Navbar visible={showContent} />

        {/* Route Transitions */}
        <AnimatedRoutes showContent={showContent} />

        {/* Ask My Work Button */}
        <AskButton visible={showContent} />
      </div>
    </BrowserRouter>
  );
}
