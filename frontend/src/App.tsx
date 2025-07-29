import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SocialMediaBar from './components/SocialMediaBar';
import BackToTop from './components/BackToTop';
import MobileBottomMenu from './components/MobileBottomMenu';
import EnquiryOffCanvas from './components/EnquiryOffCanvas';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import WebDevelopment from './pages/WebDevelopment';
import GraphicDesigning from './pages/GraphicDesigning';
import SocialMediaDesign from './pages/SocialMediaDesign';
import SocialMediaMarketing from './pages/SocialMediaMarketing';
import UIUXDesign from './pages/ui-ux-design';
import AIServices from './pages/ai-services';
import Animation3D from './pages/3d-animation';
import AppDevelopment from './pages/AppDevelopment';
import SEO from './pages/seo';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import WebDevPortfolio from './pages/WebDevPortfolio';
import GraphicPortfolio from './pages/GraphicPortfolio';
import SocialMediaDesignPortfolio from './pages/SocialMediaDesignPortfolio';
import SocialMediaMarketingPortfolio from './pages/SocialMediaMarketingPortfolio';
import FreeToolkit from './pages/FreeToolkit';
import ContactUs from './pages/ContactUs';
import RealEstate from './pages/RealEstate';
import Healthcare from './pages/Healthcare';
import Education from './pages/Education';
import Finance from './pages/Finance';
import Ecommerce from './pages/Ecommerce';
import Corporate from './pages/Corporate';
import Food from './pages/Food';
import Automotive from './pages/Automotive';
import Petroleum from './pages/Petroleum';
import Fitness from './pages/Fitness';
import IT from './pages/IT';
import Jewellery from './pages/Jewellery';
import Dashboard from './admin/Dashboard';
import AppDevPortfolio from './pages/AppDevPortfolio';

// Create a wrapper component to handle layout
const AppLayout = () => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showEnquiryCanvas, setShowEnquiryCanvas] = useState(false);
  const location = useLocation();

  const handleOpenQuoteForm = () => {
    setShowQuoteForm(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseQuoteForm = () => {
    setShowQuoteForm(false);
    document.body.style.overflow = 'auto';
  };

  const handleOpenEnquiryCanvas = () => {
    setShowEnquiryCanvas(true);
  };

  const handleCloseEnquiryCanvas = () => {
    setShowEnquiryCanvas(false);
  };

  // Check if current route is admin dashboard
  const isAdminDashboard = location.pathname.startsWith('/admin/dashboard');

  return (
    <div className="App">
      {!isAdminDashboard && (
        <>
          <Navbar onEnquireClick={handleOpenEnquiryCanvas} />
          <SocialMediaBar 
            showForm={showQuoteForm} 
            onOpenForm={handleOpenQuoteForm} 
            onCloseForm={handleCloseQuoteForm} 
          />
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/web-development" element={<WebDevelopment />} />
        <Route path="/services/graphic-designing" element={<GraphicDesigning />} />
        <Route path="/services/social-media-design" element={<SocialMediaDesign />} />
        <Route path="/services/social-media-marketing" element={<SocialMediaMarketing />} />
        <Route path="/services/ui-ux-design" element={<UIUXDesign />} />
        <Route path="/services/app-development" element={<AppDevelopment />} />
        <Route path="/services/ai-services" element={<AIServices />} />
        <Route path="/services/3d-animation" element={<Animation3D />} />
        <Route path="/services/seo" element={<SEO />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:id" element={<PortfolioDetail />} />
        <Route path="/portfolio/web-development" element={<WebDevPortfolio />} />
        <Route path="/portfolio/graphic-designing" element={<GraphicPortfolio />} />
        <Route path="/portfolio/social-media-design" element={<SocialMediaDesignPortfolio />} />
        <Route path="/portfolio/social-media-marketing" element={<SocialMediaMarketingPortfolio />} />
        <Route path="/portfolio/app-development" element={<AppDevPortfolio />} />
        <Route path="/toolkit" element={<FreeToolkit />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/industries/real-estate" element={<RealEstate />} />
        <Route path="/industries/healthcare" element={<Healthcare />} />
        <Route path="/industries/education" element={<Education />} />
        <Route path="/industries/finance" element={<Finance />} />
        <Route path="/industries/ecommerce" element={<Ecommerce />} />
        <Route path="/industries/corporate" element={<Corporate />} />
        <Route path="/industries/food" element={<Food />} />
        <Route path="/industries/automotive" element={<Automotive />} />
        <Route path="/industries/petroleum" element={<Petroleum />} />
        <Route path="/industries/fitness" element={<Fitness />} />
        <Route path="/industries/it" element={<IT />} />
        <Route path="/industries/jewellery" element={<Jewellery />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
      {!isAdminDashboard && (
        <>
          <Footer />
          <BackToTop />
          <MobileBottomMenu 
            openQuoteForm={handleOpenQuoteForm} 
            openEnquiryCanvas={handleOpenEnquiryCanvas} 
          />
          <EnquiryOffCanvas 
            isOpen={showEnquiryCanvas} 
            onClose={handleCloseEnquiryCanvas} 
          />
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
