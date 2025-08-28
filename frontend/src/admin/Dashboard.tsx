import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Login from './Login';

interface PortfolioItem {
  _id: string;
  id?: number; // Keep for backward compatibility
  title: string;
  categories: string[];
  displayCategories: string[];
  client: string;
  date: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  completionDate: string;
  technologies: string;
  websiteLink: string;
  testimonial: {
    text: string;
    author: string;
    position: string;
  };
  image: string;
  images?: string[];
  bgColor?: string;
  whatWeDelivered?: {
    description: string;
    items: Array<{
      title: string;
      icon: string;
    }>;
  };
}

interface FormBase {
  _id: string;
  name: string;
  email: string;
  phone: string;
  submittedAt: string;
  status: string;
}

interface ContactForm extends FormBase {
  subject: string;
  message: string;
}

interface EnquiryForm extends FormBase {
  company: string;
  service: string;
  message: string;
}

interface QuoteForm extends FormBase {
  company: string;
  service: string;
  budget: string;
  timeline: string;
  projectDetails: string;
}

const Dashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [isPortfolioFormOpen, setIsPortfolioFormOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    categories: [] as string[],
    client: '',
    description: '',
    challenge: '',
    solution: '',
    results: '',
    completionDate: '',
    technologies: '',
    websiteLink: '',
    testimonial: {
      text: '',
      author: '',
      position: ''
    },
    image: '',
    images: [''],
    bgColor: '#045e63',
    whatWeDelivered: {
      description: '',
      items: [
        { title: 'Attractive Design', icon: 'fa-paint-brush' },
        { title: 'Optimized Site Speed', icon: 'fa-tachometer-alt' },
        { title: 'Advanced Security', icon: 'fa-shield-alt' },
        { title: 'Engaging Content', icon: 'fa-file-alt' },
        { title: 'Responsive Website', icon: 'fa-mobile-alt' },
        { title: 'Accessibility', icon: 'fa-universal-access' }
      ]
    }
  });
  
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [sliderImageFiles, setSliderImageFiles] = useState<File[]>([]);
  const [sliderPreviewUrls, setSliderPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  
  const [activeFormTab, setActiveFormTab] = useState<'contact' | 'enquiry' | 'quote' | 'free-offer'>('contact');
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [enquiryForms, setEnquiryForms] = useState<EnquiryForm[]>([]);
  const [quoteForms, setQuoteForms] = useState<QuoteForm[]>([]);
  const [freeOfferForms, setFreeOfferForms] = useState<any[]>([]);
  const [isFormsLoading, setIsFormsLoading] = useState(false);
  const [formsError, setFormsError] = useState<string | null>(null);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [regionModalView, setRegionModalView] = useState<'both' | 'region' | 'offer'>('region');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (activePage === 'portfolio' || activePage === 'portfolio-detail') {
      fetchPortfolioItems();
    }
  }, [activePage]);
  
  const fetchPortfolioItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/portfolio');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPortfolioItems(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      setLoadError('Failed to load portfolio items');
      setIsLoading(false);
    }
  };
  
  const deletePortfolio = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        const response = await fetch(`/api/portfolio/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        setPortfolioItems(portfolioItems.filter(item => item._id !== id));
        alert('Portfolio item deleted successfully!');
        
        if (selectedPortfolio && selectedPortfolio._id === id) {
          handleNavigation('portfolio');
        }
      } catch (err) {
        console.error('Error deleting portfolio:', err);
        alert('Failed to delete portfolio item');
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleNavigation = (page: string) => {
    setActivePage(page);
    if (page !== 'portfolio-detail') {
      setSelectedPortfolio(null);
    }
  };

  const openPortfolioForm = () => {
    setIsPortfolioFormOpen(true);
    setIsViewMode(false);
    setNewPortfolio({
      title: '',
      categories: [],
      client: '',
      description: '',
      challenge: '',
      solution: '',
      results: '',
      completionDate: '',
      technologies: '',
      websiteLink: '',
      testimonial: {
        text: '',
        author: '',
        position: ''
      },
      image: '',
      images: [''],
      bgColor: '#045e63',
      whatWeDelivered: {
        description: '',
        items: [
          { title: 'Attractive Design', icon: 'fa-paint-brush' },
          { title: 'Optimized Site Speed', icon: 'fa-tachometer-alt' },
          { title: 'Advanced Security', icon: 'fa-shield-alt' },
          { title: 'Engaging Content', icon: 'fa-file-alt' },
          { title: 'Responsive Website', icon: 'fa-mobile-alt' },
          { title: 'Accessibility', icon: 'fa-universal-access' }
        ]
      }
    });
  };

  const closePortfolioForm = () => {
    setIsPortfolioFormOpen(false);
  };

  const handlePortfolioInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'categories') {
      const select = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
      setNewPortfolio({
        ...newPortfolio,
        categories: selectedOptions
      });
    } else if (name.startsWith('testimonial.')) {
      const testimonialField = name.split('.')[1];
      setNewPortfolio({
        ...newPortfolio,
        testimonial: {
          ...newPortfolio.testimonial,
          [testimonialField]: value
        }
      });
    } else if (name.startsWith('whatWeDelivered.')) {
      const whatWeDeliveredField = name.split('.')[1];
      setNewPortfolio({
        ...newPortfolio,
        whatWeDelivered: {
          ...newPortfolio.whatWeDelivered,
          [whatWeDeliveredField]: value
        }
      });
    } else if (name === 'websiteLink') {
      setNewPortfolio({
        ...newPortfolio,
        websiteLink: value
      });
    } else {
      setNewPortfolio({
        ...newPortfolio,
        [name]: value
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (name === 'image' && files && files.length > 0) {
      setMainImageFile(files[0]);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(files[0]);
      setNewPortfolio({
        ...newPortfolio,
        image: previewUrl
      });
    } else if (name === 'sliderImages' && files) {
      const selectedFiles = Array.from(files).slice(0, 3); // Limit to 3 files
      setSliderImageFiles(selectedFiles);
      
      // Create preview URLs
      const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setSliderPreviewUrls(previewUrls);
      setNewPortfolio({
        ...newPortfolio,
        images: previewUrls
      });
    }
  };

  const handleReorderSliderImages = (dragIndex: number, dropIndex: number) => {
    // Reorder files
    const newFiles = [...sliderImageFiles];
    const [draggedFile] = newFiles.splice(dragIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);
    setSliderImageFiles(newFiles);

    // Reorder preview URLs
    const newUrls = [...sliderPreviewUrls];
    const [draggedUrl] = newUrls.splice(dragIndex, 1);
    newUrls.splice(dropIndex, 0, draggedUrl);
    setSliderPreviewUrls(newUrls);

    // Update portfolio state
    setNewPortfolio({
      ...newPortfolio,
      images: newUrls
    });
  };

  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Map the category to the correct format for frontend pages
      const categoryMapping: { [key: string]: string } = {
        'Web Development': 'web',
        'Graphic Designing': 'graphic',
        'Social Media Design': 'social-design',
        'Social Media Marketing': 'social-marketing',
        'Real Estate': 'real-estate',
        'Corporate': 'corporate',
        'Education': 'education',
        'E-commerce': 'ecommerce',
        'Food': 'food',
        'Automotive': 'automotive',
        'Fitness': 'fitness',
        'Finance': 'finance',
        'Medical': 'medical',
        'Petroleum': 'petroleum',
        'Information Technology': 'it',
        'Jewellery': 'jewellery',
        'App Development': 'app-development'
      };

      setUploadProgress(20);

      // Create a FormData object to send files
      const formData = new FormData();
      
      // Add main image if available
      if (mainImageFile) {
        formData.append('image', mainImageFile);
        console.log('Main image added to form data');
      } else {
        console.log('No main image selected');
      }
      
      // Add slider images if available
      if (sliderImageFiles && sliderImageFiles.length > 0) {
        sliderImageFiles.forEach((file, index) => {
          formData.append('sliderImages', file);
          console.log(`Slider image ${index + 1} added to form data`);
        });
      } else {
        console.log('No slider images selected');
      }
      
      // Add other fields
      formData.append('title', newPortfolio.title);
      console.log('Adding title:', newPortfolio.title);
      
      // Add mapped categories
      if (newPortfolio.categories && newPortfolio.categories.length > 0) {
        newPortfolio.categories.forEach(cat => {
          const mappedCategory = categoryMapping[cat] || cat.toLowerCase();
          formData.append('categories', mappedCategory);
          console.log('Adding category:', mappedCategory);
        });
        
        // Add original category names for display
        newPortfolio.categories.forEach(cat => {
          formData.append('displayCategories', cat);
          console.log('Adding display category:', cat);
        });
      } else {
        formData.append('categories', 'uncategorized');
        formData.append('displayCategories', 'Uncategorized');
        console.log('No categories selected, using default');
      }
      
      formData.append('client', newPortfolio.client);
      formData.append('date', newPortfolio.completionDate || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }));
      formData.append('description', newPortfolio.description);
      formData.append('challenge', newPortfolio.challenge || '');
      formData.append('solution', newPortfolio.solution || '');
      formData.append('results', newPortfolio.results || '');
      formData.append('completionDate', newPortfolio.completionDate || '');
      formData.append('technologies', newPortfolio.technologies || '');
      formData.append('websiteLink', newPortfolio.websiteLink || '');
      
      // Add testimonial as JSON
      const testimonialData = {
        text: newPortfolio.testimonial.text || '',
        author: newPortfolio.testimonial.author || '',
        position: newPortfolio.testimonial.position || ''
      };
      formData.append('testimonial', JSON.stringify(testimonialData));
      console.log('Adding testimonial data');
      
      formData.append('bgColor', newPortfolio.bgColor || '#045e63');
      
      // Add whatWeDelivered as JSON
      const whatWeDeliveredData = {
        description: newPortfolio.whatWeDelivered?.description || '',
        items: newPortfolio.whatWeDelivered?.items || [
          { title: 'Attractive Design', icon: 'fa-paint-brush' },
          { title: 'Optimized Site Speed', icon: 'fa-tachometer-alt' },
          { title: 'Advanced Security', icon: 'fa-shield-alt' },
          { title: 'Engaging Content', icon: 'fa-file-alt' },
          { title: 'Responsive Website', icon: 'fa-mobile-alt' },
          { title: 'Accessibility', icon: 'fa-universal-access' }
        ]
      };
      formData.append('whatWeDelivered', JSON.stringify(whatWeDeliveredData));
      console.log('Adding whatWeDelivered data');

      setUploadProgress(50);
      console.log('Sending form data to server...');

      // Check that FormData contains all the necessary data
      console.log('FormData contains the following fields:');
      for (const key of formData.keys()) {
        console.log(`- ${key}`);
      }

      // Send data to the server
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(90);
      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        // Fetch the updated portfolio items from the server
        await fetchPortfolioItems();
        
        // Reset form and close it
        setNewPortfolio({
          title: '',
          categories: [],
          client: '',
          description: '',
          challenge: '',
          solution: '',
          results: '',
          completionDate: '',
          technologies: '',
          websiteLink: '',
          testimonial: {
            text: '',
            author: '',
            position: ''
          },
          image: '',
          images: [''],
          bgColor: '#045e63',
          whatWeDelivered: {
            description: '',
            items: [
              { title: 'Attractive Design', icon: 'fa-paint-brush' },
              { title: 'Optimized Site Speed', icon: 'fa-tachometer-alt' },
              { title: 'Advanced Security', icon: 'fa-shield-alt' },
              { title: 'Engaging Content', icon: 'fa-file-alt' },
              { title: 'Responsive Website', icon: 'fa-mobile-alt' },
              { title: 'Accessibility', icon: 'fa-universal-access' }
            ]
          }
        });
        
        // Reset file inputs
        setMainImageFile(null);
        setSliderImageFiles([]);
        setSliderPreviewUrls([]);
        setUploadProgress(100);
        closePortfolioForm();
        
        alert('Portfolio item added successfully!');
      } else {
        console.error('Error saving portfolio item:', data.error);
        alert(`Failed to save portfolio item: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error in portfolio submission:', error);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const viewPortfolioDetail = (item: PortfolioItem) => {
    setSelectedPortfolio(item);
    setActivePage('portfolio-detail');
  };

  const viewPortfolio = (item: PortfolioItem) => {
    setSelectedPortfolio(item);
    setIsViewMode(true);
    setIsPortfolioFormOpen(true);
    setNewPortfolio({
      title: item.title,
      categories: item.displayCategories || [],
      client: item.client,
      description: item.description,
      challenge: item.challenge || '',
      solution: item.solution || '',
      results: item.results || '',
      completionDate: item.completionDate || '',
      technologies: item.technologies || '',
      websiteLink: item.websiteLink || '',
      testimonial: {
        text: item.testimonial?.text || '',
        author: item.testimonial?.author || '',
        position: item.testimonial?.position || ''
      },
      image: item.image.startsWith('http') ? item.image : `${item.image}`,
      images: item.images ? item.images.map(img => img.startsWith('http') ? img : `${img}`) : [''],
      bgColor: item.bgColor || '#045e63',
      whatWeDelivered: {
        description: item.whatWeDelivered?.description || '',
        items: item.whatWeDelivered?.items || [
          { title: 'Attractive Design', icon: 'fa-paint-brush' },
          { title: 'Optimized Site Speed', icon: 'fa-tachometer-alt' },
          { title: 'Advanced Security', icon: 'fa-shield-alt' },
          { title: 'Engaging Content', icon: 'fa-file-alt' },
          { title: 'Responsive Website', icon: 'fa-mobile-alt' },
          { title: 'Accessibility', icon: 'fa-universal-access' }
        ]
      }
    });
  };

  const handleLogin = (isAuth: boolean) => {
    setIsAuthenticated(isAuth);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const fetchForms = async (formType: 'contact' | 'enquiry' | 'quote' | 'free-offer') => {
    try {
      setIsFormsLoading(true);
      setFormsError(null);
      
      console.log(`Fetching ${formType} forms...`);
      const response = await fetch(`/api/forms/${formType}`);
      const data = await response.json();
      
      console.log(`${formType} forms data:`, data);
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch ${formType} forms`);
      }
      
      switch (formType) {
        case 'contact':
          setContactForms(data);
          break;
        case 'enquiry':
          setEnquiryForms(data);
          break;
        case 'quote':
          setQuoteForms(data);
          break;
        case 'free-offer':
          setFreeOfferForms(data);
          break;
      }
    } catch (error: any) {
      console.error(`Error fetching ${formType} forms:`, error);
      setFormsError(error.message || `Failed to fetch ${formType} forms`);
    } finally {
      setIsFormsLoading(false);
    }
  };

  const updateFormStatus = async (
    formType: 'contact' | 'enquiry' | 'quote' | 'free-offer',
    formId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/forms/${formType}/${formId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update form status');
      }

      // Refresh the forms list after successful update
      fetchForms(formType);
    } catch (error) {
      setFormsError(error instanceof Error ? error.message : 'An error occurred while updating form status');
    }
  };

  const deleteForm = async (formType: 'contact' | 'enquiry' | 'quote' | 'free-offer', formId: string) => {
    if (!window.confirm('Are you sure you want to delete this form submission?')) {
      return;
    }

    try {
      const response = await fetch(`/api/forms/${formType}/${formId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      // Refresh the forms list after successful deletion
      fetchForms(formType);
    } catch (error) {
      setFormsError(error instanceof Error ? error.message : 'An error occurred while deleting form');
    }
  };

  // Add useEffect to fetch forms when tab changes
  useEffect(() => {
    if (activePage === 'forms') {
      fetchForms(activeFormTab);
    }
  }, [activePage, activeFormTab]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="admin-layout">
      <div className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <h1>KeplerX</h1>
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            <i className={`fas ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>
        
        <div className="admin-sidebar-nav">
          <ul>
            <li 
              className={activePage === 'dashboard' ? 'active' : ''} 
              onClick={() => handleNavigation('dashboard')}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </li>
            <li className={`has-sub ${isRegionOpen ? 'open' : ''}`}> 
              <div className="menu-item" onClick={() => { setIsRegionOpen(!isRegionOpen); handleNavigation('forms'); }}>
                <i className="fas fa-wpforms"></i>
                <span>Forms</span>
                <i className="fas fa-angle-left dropdown-icon"></i>
              </div>
              {isRegionOpen && (
                <ul className="sub-menu">
                  <li 
                    className={activeFormTab === 'contact' && activePage==='forms' ? 'active' : ''}
                    onClick={() => { setActiveFormTab('contact'); handleNavigation('forms'); }}
                  >
                    Contact
                  </li>
                  <li 
                    className={activeFormTab === 'enquiry' && activePage==='forms' ? 'active' : ''}
                    onClick={() => { setActiveFormTab('enquiry'); handleNavigation('forms'); }}
                  >
                    Enquiry
                  </li>
                  <li 
                    className={activeFormTab === 'quote' && activePage==='forms' ? 'active' : ''}
                    onClick={() => { setActiveFormTab('quote'); handleNavigation('forms'); }}
                  >
                    Quotes
                  </li>
                  <li 
                    className={activeFormTab === 'free-offer' && activePage==='forms' ? 'active' : ''}
                    onClick={() => { setActiveFormTab('free-offer'); handleNavigation('forms'); }}
                  >
                    Free Offers
                  </li>
                </ul>
              )}
            </li>
            <li 
              className={activePage === 'users' ? 'active' : ''} 
              onClick={() => handleNavigation('users')}
            >
              <i className="fas fa-users"></i>
              <span>Users</span>
            </li>
            <li 
              className={activePage === 'projects' ? 'active' : ''} 
              onClick={() => handleNavigation('projects')}
            >
              <i className="fas fa-project-diagram"></i>
              <span>Projects</span>
            </li>
            <li 
              className={activePage === 'portfolio' || activePage === 'portfolio-detail' ? 'active' : ''} 
              onClick={() => handleNavigation('portfolio')}
            >
              <i className="fas fa-images"></i>
              <span>Portfolio</span>
            </li>
            <li 
              className={activePage === 'messages' ? 'active' : ''} 
              onClick={() => handleNavigation('messages')}
            >
              <i className="fas fa-envelope"></i>
              <span>Messages</span>
            </li>
            <li 
              className={activePage === 'tasks' ? 'active' : ''} 
              onClick={() => handleNavigation('tasks')}
            >
              <i className="fas fa-tasks"></i>
              <span>Tasks</span>
            </li>
            <li 
              className={activePage === 'analytics' ? 'active' : ''} 
              onClick={() => handleNavigation('analytics')}
            >
              <i className="fas fa-chart-line"></i>
              <span>Analytics</span>
            </li>
            <li 
              className={activePage === 'settings' ? 'active' : ''} 
              onClick={() => handleNavigation('settings')}
            >
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </li>
          </ul>
        </div>
        
        <div className="admin-sidebar-footer">
          <a href="/" className="back-to-site">
            <i className="fas fa-external-link-alt"></i>
            <span>Back to Website</span>
          </a>
          <div className="admin-user">
            <div className="admin-avatar">
              A
            </div>
            <div className="admin-info">
              <p className="admin-name">Admin User</p>
              <a href="#" className="admin-logout" onClick={handleLogout}>Logout</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`admin-main ${isSidebarCollapsed ? 'expanded' : ''}`}>
        <div className="admin-topbar">
          <div className="topbar-left">
            {activePage === 'portfolio-detail' ? (
              <div className="breadcrumb">
                <span onClick={() => handleNavigation('portfolio')} className="breadcrumb-link">Portfolio</span>
                <i className="fas fa-chevron-right breadcrumb-separator"></i>
                <span className="breadcrumb-current">{selectedPortfolio?.title}</span>
              </div>
            ) : (
              <h2>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h2>
            )}
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <input type="text" placeholder="Search..." />
              <i className="fas fa-search"></i>
            </div>
            <div className="notification-bell">
              <i className="fas fa-bell"></i>
              <div className="notification-badge">4</div>
            </div>
            <div className="admin-profile">
              <img src="https://via.placeholder.com/40" alt="Admin" />
            </div>
          </div>
        </div>
        
        <div className="admin-content">
          {activePage === 'dashboard' && (
            <>
              <div className="admin-stats">
                <div className="stats-card">
                  <div className="stats-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stats-info">
                    <h3>Total Users</h3>
                    <div className="stats-number">8,249</div>
                    <div className="stats-change positive">+12.5% this month</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">
                    <i className="fas fa-project-diagram"></i>
                  </div>
                  <div className="stats-info">
                    <h3>Projects</h3>
                    <div className="stats-number">142</div>
                    <div className="stats-change positive">+8.3% this month</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="stats-info">
                    <h3>Revenue</h3>
                    <div className="stats-number">$142,503</div>
                    <div className="stats-change positive">+5.4% this month</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">
                    <i className="fas fa-ticket-alt"></i>
                  </div>
                  <div className="stats-info">
                    <h3>Support Tickets</h3>
                    <div className="stats-number">48</div>
                    <div className="stats-change negative">-2.5% this month</div>
                  </div>
                </div>
              </div>
              
              <div className="admin-section-row">
                <div className="admin-section-card">
                  <h3>Recent Projects</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Project Name</th>
                          <th>Client</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>E-commerce Website</td>
                          <td>Fashion Store Inc.</td>
                          <td><span className="status-badge in-progress">In Progress</span></td>
                          <td>
                            <button className="action-btn edit">Edit</button>
                            <button className="action-btn view">View</button>
                          </td>
                        </tr>
                        <tr>
                          <td>Corporate Branding</td>
                          <td>Tech Solutions LLC</td>
                          <td><span className="status-badge completed">Completed</span></td>
                          <td>
                            <button className="action-btn edit">Edit</button>
                            <button className="action-btn view">View</button>
                          </td>
                        </tr>
                        <tr>
                          <td>Mobile App Development</td>
                          <td>HealthTrack</td>
                          <td><span className="status-badge in-progress">In Progress</span></td>
                          <td>
                            <button className="action-btn edit">Edit</button>
                            <button className="action-btn view">View</button>
                          </td>
                        </tr>
                        <tr>
                          <td>SEO Optimization</td>
                          <td>Beauty Salon</td>
                          <td><span className="status-badge pending">Pending</span></td>
                          <td>
                            <button className="action-btn edit">Edit</button>
                            <button className="action-btn view">View</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <a href="#" className="view-all-link">View All Projects</a>
                </div>
                
                <div className="admin-section-card">
                  <h3>Recent Messages</h3>
                  <div className="message-list">
                    <div className="message-item">
                      <div className="message-avatar">J</div>
                      <div className="message-content">
                        <div className="message-header">
                          <h4>John Smith</h4>
                          <span className="message-time">2 hours ago</span>
                        </div>
                        <p>We would like to discuss the pricing options for our new project. Can we schedule a call?</p>
                      </div>
                    </div>
                    <div className="message-item">
                      <div className="message-avatar">A</div>
                      <div className="message-content">
                        <div className="message-header">
                          <h4>Alice Johnson</h4>
                          <span className="message-time">Yesterday</span>
                        </div>
                        <p>Thank you for the quick response. The design looks great, we just need a few minor adjustments.</p>
                      </div>
                    </div>
                    <div className="message-item">
                      <div className="message-avatar">M</div>
                      <div className="message-content">
                        <div className="message-header">
                          <h4>Michael Brown</h4>
                          <span className="message-time">2 days ago</span>
                        </div>
                        <p>Is it possible to add a new feature to our website? We need a booking system integrated.</p>
                      </div>
                    </div>
                    <div className="message-item">
                      <div className="message-avatar">S</div>
                      <div className="message-content">
                        <div className="message-header">
                          <h4>Sarah Lee</h4>
                          <span className="message-time">3 days ago</span>
                        </div>
                        <p>I'm impressed with the work your team has done on our social media campaign. The engagement has increased by 45%!</p>
                      </div>
                    </div>
                  </div>
                  <a href="#" className="view-all-link">View All Messages</a>
                </div>
              </div>
            </>
          )}

          {activePage === 'portfolio' && (
            <div className="portfolio-section">
              <div className="admin-section-header">
                <h3>Portfolio Management</h3>
                <button className="add-button" onClick={openPortfolioForm}>
                  <i className="fas fa-plus"></i> Add Portfolio
                </button>
              </div>
              
              {isLoading ? (
                <div className="loading-container">
                  <p>Loading portfolio items...</p>
                </div>
              ) : loadError ? (
                <div className="error-container">
                  <p>{loadError}</p>
                  <button 
                    className="retry-btn" 
                    onClick={fetchPortfolioItems}
                  >
                    Retry
                  </button>
                </div>
              ) : portfolioItems.length === 0 ? (
                <div className="empty-container">
                  <p>No portfolio items found. Add your first portfolio item!</p>
                </div>
              ) : (
                <div className="portfolio-grid">
                  {portfolioItems.map(item => (
                    <div className="portfolio-card" key={item._id}>
                      <div className="portfolio-image">
                        <img 
                          src={item.image.startsWith('http') ? item.image : `${item.image}`} 
                          alt={item.title} 
                        />
                        <div className="portfolio-actions">
                          <button 
                            className="portfolio-action-btn edit" 
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              viewPortfolio(item);
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="portfolio-action-btn view" 
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              viewPortfolioDetail(item);
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="portfolio-action-btn delete" 
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              deletePortfolio(item._id);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                      <div className="portfolio-details">
                        <h4>{item.title}</h4>
                        <div className="portfolio-meta">
                          <span className="portfolio-category">{item.displayCategories ? item.displayCategories.join(', ') : 'Uncategorized'}</span>
                          <span className="portfolio-client">{item.client}</span>
                        </div>
                        <div className="portfolio-date">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activePage === 'portfolio-detail' && selectedPortfolio && (
            <div className="portfolio-detail-section">
              <div className="portfolio-detail-header">
                <div className="portfolio-detail-image">
                  <img 
                    src={selectedPortfolio.image.startsWith('http') ? selectedPortfolio.image : `${selectedPortfolio.image}`} 
                    alt={selectedPortfolio.title} 
                  />
                </div>
                <div className="portfolio-detail-info">
                  <h1>{selectedPortfolio.title}</h1>
                  <div className="detail-meta">
                    <div className="meta-item">
                      <strong>Client:</strong> {selectedPortfolio.client}
                    </div>
                    <div className="meta-item">
                      <strong>Categories:</strong> {selectedPortfolio.displayCategories ? selectedPortfolio.displayCategories.join(', ') : 'Uncategorized'}
                    </div>
                    <div className="meta-item">
                      <strong>Completion Date:</strong> {selectedPortfolio.completionDate}
                    </div>
                    <div className="meta-item technologies">
                      <strong>Technologies:</strong> {selectedPortfolio.technologies}
                    </div>
                  </div>
                </div>
              </div>

              <div className="portfolio-detail-content">
                <div className="content-section">
                  <h2>Project Description</h2>
                  <p>{selectedPortfolio.description}</p>
                </div>

                <div className="content-section">
                  <h2>The Challenge</h2>
                  <p>{selectedPortfolio.challenge}</p>
                </div>

                <div className="content-section">
                  <h2>Our Solution</h2>
                  <p>{selectedPortfolio.solution}</p>
                </div>

                <div className="content-section">
                  <h2>The Results</h2>
                  <p>{selectedPortfolio.results}</p>
                </div>

                <div className="content-section testimonial">
                  <h2>Client Testimonial</h2>
                  <div className="testimonial-content">
                    <div className="quote-icon">❝</div>
                    <p>{selectedPortfolio.testimonial.text}</p>
                    <div className="testimonial-author">
                      <p className="author-name">{selectedPortfolio.testimonial.author}</p>
                      <p className="author-position">{selectedPortfolio.testimonial.position}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-actions">
                  <button 
                    className="action-button edit-button" 
                    onClick={() => viewPortfolio(selectedPortfolio)}
                  >
                    <i className="fas fa-edit"></i> Edit Portfolio
                  </button>
                  <button 
                    className="action-button delete-button" 
                    onClick={() => {
                      deletePortfolio(selectedPortfolio._id);
                    }}
                  >
                    <i className="fas fa-trash-alt"></i> Delete Portfolio
                  </button>
                  {selectedPortfolio.websiteLink && (
                    <a 
                      href={selectedPortfolio.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button view-website-button"
                    >
                      <i className="fas fa-external-link-alt"></i> View Website
                    </a>
                  )}
                  <button 
                    className="action-button back-button" 
                    onClick={() => handleNavigation('portfolio')}
                  >
                    <i className="fas fa-arrow-left"></i> Back to Portfolio
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activePage === 'users' && (
            <div className="admin-section-card">
              <h3>User Management</h3>
              <p>User management content will go here</p>
            </div>
          )}
          {activePage === 'projects' && (
            <div className="admin-section-card">
              <h3>Project Management</h3>
              <p>Project management content will go here</p>
            </div>
          )}
          {activePage === 'messages' && (
            <div className="admin-section-card">
              <h3>Message Center</h3>
              <p>Message center content will go here</p>
            </div>
          )}
          {activePage === 'tasks' && (
            <div className="admin-section-card">
              <h3>Task Management</h3>
              <p>Task management content will go here</p>
            </div>
          )}
          {activePage === 'analytics' && (
            <div className="admin-section-card">
              <h3>Analytics Dashboard</h3>
              <p>Analytics content will go here</p>
            </div>
          )}
          {activePage === 'settings' && (
            <div className="admin-section-card">
              <h3>System Settings</h3>
              <p>Settings content will go here</p>
            </div>
          )}
          {activePage === 'forms' && (
            <div className="forms-section">
              <div className="admin-section-header">
                <h3>Forms Management</h3>
              </div>

              {/* Horizontal tabs removed – navigation now only via sidebar sub-menu */}

              {isFormsLoading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading form submissions...</p>
                </div>
              ) : formsError ? (
                <div className="error-container">
                  <p>{formsError}</p>
                  <button onClick={() => fetchForms(activeFormTab)} className="retry-btn">
                    Retry
                  </button>
                </div>
              ) : (
                <div className="forms-content">
                  {activeFormTab === 'contact' && (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contactForms.map(form => (
                            <tr key={form._id}>
                              <td>{form.name}</td>
                              <td>{form.email}</td>
                              <td>{form.phone}</td>
                              <td>{form.subject}</td>
                              <td>{form.message.substring(0, 50)}...</td>
                              <td>{new Date(form.submittedAt).toLocaleDateString()}</td>
                              <td>
                                <select 
                                  value={form.status}
                                  onChange={(e) => updateFormStatus('contact', form._id, e.target.value)}
                                  className={`status-select ${form.status}`}
                                >
                                  <option value="new">New</option>
                                  <option value="read">Read</option>
                                  <option value="responded">Responded</option>
                                </select>
                              </td>
                              <td>
                                <button 
                                  onClick={() => deleteForm('contact', form._id)}
                                  className="delete-btn"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeFormTab === 'enquiry' && (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Service</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enquiryForms.map(form => (
                            <tr key={form._id}>
                              <td>{form.name}</td>
                              <td>{form.email}</td>
                              <td>{form.phone}</td>
                              <td>{form.company}</td>
                              <td>{form.service}</td>
                              <td>{form.message.substring(0, 50)}...</td>
                              <td>{new Date(form.submittedAt).toLocaleDateString()}</td>
                              <td>
                                <select 
                                  value={form.status}
                                  onChange={(e) => updateFormStatus('enquiry', form._id, e.target.value)}
                                  className={`status-select ${form.status}`}
                                >
                                  <option value="new">New</option>
                                  <option value="read">Read</option>
                                  <option value="responded">Responded</option>
                                </select>
                              </td>
                              <td>
                                <button 
                                  onClick={() => deleteForm('enquiry', form._id)}
                                  className="delete-btn"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeFormTab === 'quote' && (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Service</th>
                            <th>Budget</th>
                            <th>Timeline</th>
                            <th>Details</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quoteForms.map(form => (
                            <tr key={form._id}>
                              <td>{form.name}</td>
                              <td>{form.email}</td>
                              <td>{form.phone}</td>
                              <td>{form.company}</td>
                              <td>{form.service}</td>
                              <td>{form.budget}</td>
                              <td>{form.timeline}</td>
                              <td>{form.projectDetails.substring(0, 50)}...</td>
                              <td>{new Date(form.submittedAt).toLocaleDateString()}</td>
                              <td>
                                <select 
                                  value={form.status}
                                  onChange={(e) => updateFormStatus('quote', form._id, e.target.value)}
                                  className={`status-select ${form.status}`}
                                >
                                  <option value="new">New</option>
                                  <option value="read">Read</option>
                                  <option value="quoted">Quoted</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </td>
                              <td>
                                <button 
                                  onClick={() => deleteForm('quote', form._id)}
                                  className="delete-btn"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeFormTab === 'free-offer' && (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {freeOfferForms.map(form => (
                            <tr key={form._id}>
                              <td>{form.email}</td>
                              <td>{form.message?.substring(0,50)}...</td>
                              <td>{new Date(form.submittedAt).toLocaleDateString()}</td>
                              <td>
                                <select 
                                  value={form.status}
                                  onChange={(e) => updateFormStatus('free-offer', form._id, e.target.value)}
                                  className={`status-select ${form.status}`}
                                >
                                  <option value="new">New</option>
                                  <option value="read">Read</option>
                                  <option value="responded">Responded</option>
                                </select>
                              </td>
                              <td>
                                <button className="delete-btn" onClick={() => deleteForm('free-offer', form._id)}>
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Portfolio Form Off-Canvas */}
      <div className={`portfolio-offcanvas ${isPortfolioFormOpen ? 'open' : ''}`}>
        <div className="portfolio-offcanvas-header">
          <h3>{isViewMode ? 'Edit Portfolio' : 'Add New Portfolio'}</h3>
          <button className="close-offcanvas" onClick={closePortfolioForm}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="portfolio-offcanvas-body">
          <form className="admin-portfolio-form" onSubmit={handlePortfolioSubmit}>
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="title">Project Title</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={newPortfolio.title} 
                onChange={handlePortfolioInputChange} 
                required 
                placeholder="Enter project title"
                disabled={isViewMode}
                className="admin-form-input"
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="categories">Categories</label>
              <select 
                id="categories" 
                name="categories" 
                value={newPortfolio.categories} 
                onChange={handlePortfolioInputChange} 
                required
                disabled={isViewMode}
                multiple
                className="admin-form-select"
              >
                <option value="Web Development">Web Development</option>
                <option value="App Development">App Development</option>
                <option value="Graphic Designing">Graphic Designing</option>
                <option value="Social Media Design">Social Media Design</option>
                <option value="Social Media Marketing">Social Media Marketing</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Corporate">Corporate</option>
                <option value="Education">Education</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Food">Food</option>
                <option value="Automotive">Automotive</option>
                <option value="Fitness">Fitness</option>
                <option value="Finance">Finance</option>
                <option value="Medical">Medical</option>
                <option value="Petroleum">Petroleum</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Jewellery">Jewellery</option>
              </select>
              <small className="admin-form-hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories</small>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="client">Client</label>
              <input 
                type="text" 
                id="client" 
                name="client" 
                value={newPortfolio.client} 
                onChange={handlePortfolioInputChange} 
                required 
                placeholder="Enter client name"
                disabled={isViewMode}
                className="admin-form-input"
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="completionDate">Completion Date</label>
              <input 
                type="text" 
                id="completionDate" 
                name="completionDate" 
                value={newPortfolio.completionDate} 
                onChange={handlePortfolioInputChange} 
                placeholder="Enter completion date (e.g., March 15, 2025)"
                disabled={isViewMode}
                className="admin-form-input"
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="description">Description</label>
              <textarea 
                id="description" 
                name="description" 
                value={newPortfolio.description} 
                onChange={handlePortfolioInputChange} 
                required 
                placeholder="Enter project description"
                rows={3}
                disabled={isViewMode}
                className="admin-form-textarea"
              ></textarea>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="challenge">The Challenge</label>
              <textarea 
                id="challenge" 
                name="challenge" 
                value={newPortfolio.challenge} 
                onChange={handlePortfolioInputChange} 
                placeholder="Describe the challenge faced in this project"
                rows={3}
                disabled={isViewMode}
                className="admin-form-textarea"
              ></textarea>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="solution">Our Solution</label>
              <textarea 
                id="solution" 
                name="solution" 
                value={newPortfolio.solution} 
                onChange={handlePortfolioInputChange} 
                placeholder="Describe the solution provided"
                rows={3}
                disabled={isViewMode}
                className="admin-form-textarea"
              ></textarea>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="results">The Results</label>
              <textarea 
                id="results" 
                name="results" 
                value={newPortfolio.results} 
                onChange={handlePortfolioInputChange} 
                placeholder="Describe the results achieved"
                rows={3}
                disabled={isViewMode}
                className="admin-form-textarea"
              ></textarea>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="technologies">Technologies Used</label>
              <input 
                type="text" 
                id="technologies" 
                name="technologies" 
                value={newPortfolio.technologies} 
                onChange={handlePortfolioInputChange} 
                placeholder="Enter technologies used (comma separated)"
                disabled={isViewMode}
                className="admin-form-input"
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="websiteLink">Website Link</label>
              <input 
                type="url" 
                id="websiteLink" 
                name="websiteLink" 
                value={newPortfolio.websiteLink} 
                onChange={handlePortfolioInputChange} 
                placeholder="Enter website URL (e.g., https://example.com)"
                disabled={isViewMode}
                className="admin-form-input"
              />
              <small className="admin-form-hint">Enter the full URL including http:// or https://</small>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="image">Main Image</label>
              {!isViewMode ? (
                <div className="admin-file-upload">
                  <input 
                    type="file" 
                    id="image" 
                    name="image" 
                    accept="image/*"
                    onChange={handleFileInputChange}
                    disabled={isViewMode || isUploading}
                    className="admin-file-input"
                  />
                  <div className="admin-file-upload-icon">
                    <i className="fas fa-image"></i>
                  </div>
                  <p className="admin-file-upload-text">Click to upload main image</p>
                </div>
              ) : (
                <div className="admin-image-preview">
                  <img src={newPortfolio.image} alt="Portfolio" />
                  <div className="admin-image-preview-label">Main Image</div>
                </div>
              )}
              <small className="admin-form-hint">Upload a main image for the portfolio card (recommended size: 300x200px)</small>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="sliderImages">Slider Images (Maximum 3)</label>
              {!isViewMode ? (
                <>
                  <div className="admin-file-upload">
                    <input 
                      type="file" 
                      id="sliderImages" 
                      name="sliderImages" 
                      accept="image/*"
                      onChange={handleFileInputChange}
                      disabled={isViewMode || isUploading}
                      multiple
                      className="admin-file-input"
                    />
                    <div className="admin-file-upload-icon">
                      <i className="fas fa-images"></i>
                    </div>
                    <p className="admin-file-upload-text">Click to upload slider images (select up to 3)</p>
                  </div>
                  
                  {sliderPreviewUrls.length > 0 && (
                    <div className="admin-slider-preview">
                      {sliderPreviewUrls.map((url, index) => (
                        <div 
                          key={index} 
                          className="admin-slider-preview-item"
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                            handleReorderSliderImages(dragIndex, index);
                          }}
                        >
                          <img src={url} alt={`Slider ${index + 1}`} />
                          <div className="admin-slider-preview-number">{index + 1}</div>
                          <div className="admin-slider-preview-overlay">
                            <i className="fas fa-arrows-alt"></i>
                            <span>Drag to reorder</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="admin-slider-preview">
                  {newPortfolio.images && newPortfolio.images.map((src, index) => (
                    <div key={index} className="admin-slider-preview-item">
                      <img src={src} alt={`Slider ${index + 1}`} />
                      <div className="admin-slider-preview-number">{index + 1}</div>
                    </div>
                  ))}
                </div>
              )}
              <small className="admin-form-hint">Upload up to 3 images for the slider (recommended size: 800x600px). Drag and drop to reorder images.</small>
            </div>
            
            <div className="admin-form-divider">
              <h4>Client Testimonial</h4>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="testimonial.text">Testimonial Text</label>
              <textarea 
                id="testimonial.text" 
                name="testimonial.text" 
                value={newPortfolio.testimonial.text} 
                onChange={handlePortfolioInputChange} 
                placeholder="Enter client testimonial"
                rows={3}
                disabled={isViewMode}
                className="admin-form-textarea"
              ></textarea>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="testimonial.author">Author Name</label>
              <input 
                type="text" 
                id="testimonial.author" 
                name="testimonial.author" 
                value={newPortfolio.testimonial.author} 
                onChange={handlePortfolioInputChange} 
                placeholder="Enter testimonial author name"
                disabled={isViewMode}
                className="admin-form-input"
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="testimonial.position">Author Position</label>
              <input 
                type="text" 
                id="testimonial.position" 
                name="testimonial.position" 
                value={newPortfolio.testimonial.position} 
                onChange={handlePortfolioInputChange} 
                placeholder="Enter author's position/title"
                disabled={isViewMode}
                className="admin-form-input"
              />
            </div>
            
            <div className="admin-form-divider">
              <h4>What We Delivered</h4>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="whatWeDelivered.description">Description</label>
              <textarea 
                id="whatWeDelivered.description" 
                name="whatWeDelivered.description" 
                value={newPortfolio.whatWeDelivered ? newPortfolio.whatWeDelivered.description : ''}
                onChange={handlePortfolioInputChange} 
                placeholder="Enter description of what was delivered"
                rows={3}
                disabled={isViewMode}
                className="admin-form-textarea"
              ></textarea>
            </div>
            
            {isUploading && (
              <div className="admin-upload-progress">
                <div className="admin-progress-bar">
                  <div className="admin-progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <div className="admin-progress-text">{uploadProgress}% Uploaded</div>
              </div>
            )}
            
            <div className="admin-form-actions">
              {isViewMode ? (
                <>
                  <button 
                    type="button" 
                    className="admin-btn-submit" 
                    onClick={() => {
                      if (selectedPortfolio) {
                        closePortfolioForm();
                        const item = portfolioItems.find(item => item._id === selectedPortfolio._id);
                        if (item) {
                          viewPortfolioDetail(item);
                        }
                      }
                    }}
                  >
                    View Details
                  </button>
                  <button 
                    type="button" 
                    className="admin-btn-cancel" 
                    onClick={closePortfolioForm}
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="admin-btn-cancel" 
                    onClick={closePortfolioForm}
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="admin-btn-submit" 
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Add Portfolio'}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Off-canvas overlay */}
      {isPortfolioFormOpen && (
        <div className="offcanvas-overlay" onClick={closePortfolioForm}></div>
      )}
    </div>
  );
};

export default Dashboard; 