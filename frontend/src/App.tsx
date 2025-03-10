import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import WebDevelopment from './pages/WebDevelopment';
import GraphicDesigning from './pages/GraphicDesigning';
import Portfolio from './pages/Portfolio';
import FreeToolkit from './pages/FreeToolkit';
import ContactUs from './pages/ContactUs';
import RealEstate from './pages/RealEstate';
import Healthcare from './pages/Healthcare';
import Education from './pages/Education';
import Finance from './pages/Finance';
import Ecommerce from './pages/Ecommerce';
import Corporate from './pages/Corporate';

function App() {
  // Simple routing without react-router-dom
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', onLocationChange);

    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  // Render the appropriate component based on path
  const renderContent = () => {
    switch (currentPath) {
      case '/about':
        return <About />;
      case '/services':
        return <Services />;
      case '/services/web-development':
        return <WebDevelopment />;
      case '/services/graphic-designing':
        return <GraphicDesigning />;
      case '/portfolio':
        return <Portfolio />;
      case '/toolkit':
        return <FreeToolkit />;
      case '/contact':
        return <ContactUs />;
      case '/industries/real-estate':
        return <RealEstate />;
      case '/industries/healthcare':
        return <Healthcare />;
      case '/industries/education':
        return <Education />;
      case '/industries/finance':
        return <Finance />;
      case '/industries/ecommerce':
        return <Ecommerce />;
      case '/industries/corporate':
        return <Corporate />;
      case '/':
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      <Navbar />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;
