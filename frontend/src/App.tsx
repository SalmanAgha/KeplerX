import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Marketplace from './pages/Marketplace';
import ProjectDetail from './pages/ProjectDetail';
import Dashboard from './admin/Dashboard';

const LegalRedirect: React.FC<{ path: string }> = ({ path }) => {
  useEffect(() => {
    window.location.replace(path);
  }, [path]);

  return null;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="App">
      {!isAdmin && <Navbar />}
      <div key={location.pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:slug" element={<ProjectDetail />} />
          <Route path="/privacy" element={<LegalRedirect path="/privacy/" />} />
          <Route path="/terms" element={<LegalRedirect path="/terms/" />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          {/* Catch-all redirect */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      {!isAdmin && (
        <>
          <Footer />
          <BackToTop />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
