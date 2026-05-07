import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Login from './Login';
import MarketplaceAdmin from './MarketplaceAdmin';

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

interface MissionBrief {
  _id: string;
  name: string;
  email: string;
  company?: string;
  service: string;
  budget: string;
  message: string;
  status: string;
  submittedAt: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  createdat: string;
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
  
  const [missionBriefs, setMissionBriefs] = useState<MissionBrief[]>([]);
  const [isFormsLoading, setIsFormsLoading] = useState(false);
  const [formsError, setFormsError] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Mission Brief', text: 'Sarah Chen submitted a new brief.', time: '2 mins ago', read: false },
    { id: 2, title: 'Portfolio Updated', text: 'Marketplace item "AI Platform" was edited.', time: '1 hour ago', read: true },
    { id: 3, title: 'System Alert', text: 'SMTP connection tested successfully.', time: '5 hours ago', read: false },
  ]);
  
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

  const fetchMissionBriefs = async () => {
    try {
      setIsFormsLoading(true);
      setFormsError(null);
      const response = await fetch('/api/forms');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch mission briefs');
      setMissionBriefs(data);
    } catch (error: any) {
      console.error('Error fetching mission briefs:', error);
      setFormsError(error.message || 'Failed to fetch mission briefs');
    } finally {
      setIsFormsLoading(false);
    }
  };

  const updateFormStatus = async (formId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      fetchMissionBriefs();
    } catch (error: any) {
      setFormsError(error instanceof Error ? error.message : 'An error occurred while updating status');
    }
  };

  const deleteForm = async (formId: string) => {
    if (!window.confirm('Are you sure you want to delete this brief?')) return;
    try {
      const response = await fetch(`/api/forms/${formId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete brief');
      setMissionBriefs(missionBriefs.filter(brief => brief._id !== formId));
      alert('Brief deleted successfully');
    } catch (err) {
      alert('Error deleting brief');
    }
  };

  const fetchUsers = async () => {
    try {
      setIsUsersLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      setAdminUsers(data);
      setIsUsersLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activePage === 'users') {
      fetchUsers();
    }
  }, [activePage]);

  useEffect(() => {
    if (activePage === 'forms' || activePage === 'dashboard') {
      fetchMissionBriefs();
    }
  }, [activePage]);

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
            <li className={activePage === 'forms' ? 'active' : ''} onClick={() => setActivePage('forms')}>
                <i className="fas fa-file-alt"></i>
                <span>Mission Briefs</span>
                {missionBriefs.some(b => b.status === 'new') && <span className="nav-badge">New</span>}
              </li>
              <li className={activePage === 'users' ? 'active' : ''} onClick={() => setActivePage('users')}>
                <i className="fas fa-users-cog"></i>
                <span>User Management</span>
              </li>
              <li className={activePage === 'portfolio' ? 'active' : ''} onClick={() => setActivePage('portfolio')}>
                <i className="fas fa-briefcase"></i>
                <span>Portfolio</span>
              </li>
            <li 
              className={activePage === 'marketplace' ? 'active' : ''} 
              onClick={() => handleNavigation('marketplace')}
            >
              <i className="fas fa-store"></i>
              <span>AI Marketplace</span>
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
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search..." />
              </div>
              <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
                <i className="fas fa-bell"></i>
                {notifications.some(n => !n.read) && <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>}
                
                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                      <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>Mark all read</button>
                    </div>
                    <div className="notifications-list">
                      {notifications.map(n => (
                        <div key={n.id} className={`notification-item ${n.read ? 'read' : ''}`}>
                          <div className="notification-icon">
                            <i className={n.title.includes('Brief') ? 'fas fa-paper-plane' : 'fas fa-info-circle'}></i>
                          </div>
                          <div className="notification-info">
                            <h4>{n.title}</h4>
                            <p>{n.text}</p>
                            <span className="notification-time">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="admin-profile">
                <img src="https://i.pravatar.cc/150?u=keplerx-admin" alt="Admin Avatar" />
              </div>
            </div>
        </div>
        
        <div className="admin-content">
          {activePage === 'dashboard' && (
            <>
              <div className="admin-stats">
                <div className="stats-card">
                  <div className="stats-icon"><i className="fas fa-paper-plane"></i></div>
                  <div className="stats-info">
                    <h3>Total Briefs</h3>
                    <div className="stats-number">{missionBriefs.length}</div>
                    <div className="stats-change positive">Lifetime Submissions</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon"><i className="fas fa-bell"></i></div>
                  <div className="stats-info">
                    <h3>Action Required</h3>
                    <div className="stats-number">{missionBriefs.filter(b => b.status === 'new').length}</div>
                    <div className="stats-change negative">Awaiting Review</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon"><i className="fas fa-check-circle"></i></div>
                  <div className="stats-info">
                    <h3>Converted</h3>
                    <div className="stats-number">{missionBriefs.filter(b => b.status === 'converted').length}</div>
                    <div className="stats-change positive">Project Success</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon"><i className="fas fa-briefcase"></i></div>
                  <div className="stats-info">
                    <h3>Portfolio</h3>
                    <div className="stats-number">{portfolioItems.length}</div>
                    <div className="stats-change positive">Showcased Items</div>
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
                  <h3>Recent Mission Briefs</h3>
                  <div className="message-list">
                    {missionBriefs.length === 0 ? (
                      <div className="no-data">No briefs received yet.</div>
                    ) : (
                      missionBriefs.slice(0, 4).map(brief => (
                        <div key={brief._id} className="message-item">
                          <div className="message-avatar">{brief.name.charAt(0)}</div>
                          <div className="message-content">
                            <div className="message-header">
                              <h4>{brief.name}</h4>
                              <span className="message-time">{new Date(brief.submittedAt).toLocaleDateString()}</span>
                            </div>
                            <p>{brief.message.substring(0, 100)}{brief.message.length > 100 ? '...' : ''}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <a href="#" onClick={() => handleNavigation('forms')} className="view-all-link">View All Briefs</a>
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
          
          {activePage === 'marketplace' && (
            <MarketplaceAdmin />
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
                  <button onClick={() => fetchMissionBriefs()} className="retry-btn">
                    Retry
                  </button>
                </div>
              ) : (
                <div className="forms-content">
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Company</th>
                          <th>Service</th>
                          <th>Budget</th>
                          <th>Message</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {missionBriefs.map(brief => (
                          <tr key={brief._id}>
                            <td><strong>{brief.name}</strong></td>
                            <td>{brief.email}</td>
                            <td>{brief.company || '-'}</td>
                            <td><span className="service-tag">{brief.service}</span></td>
                            <td>{brief.budget}</td>
                            <td><div className="brief-msg">{brief.message}</div></td>
                            <td>{new Date(brief.submittedAt).toLocaleDateString()}</td>
                            <td>
                              <select 
                                value={brief.status}
                                onChange={(e) => updateFormStatus(brief._id, e.target.value)}
                                className={`status-select ${brief.status}`}
                              >
                                <option value="new">New</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="contacted">Contacted</option>
                                <option value="converted">Converted</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>
                            <td>
                              <button onClick={() => deleteForm(brief._id)} className="delete-btn">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePage === 'users' && (
            <div className="users-section">
              <div className="admin-section-header">
                <h3>User Management</h3>
                <button className="add-button" onClick={() => alert('Add User Modal coming soon!')}>
                  <i className="fas fa-plus"></i> Add User
                </button>
              </div>
              
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>SMTP Host</th>
                      <th>SMTP User</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map(user => (
                      <tr key={user.id}>
                        <td><strong>{user.name}</strong></td>
                        <td>{user.email}</td>
                        <td><span className="service-tag">{user.role}</span></td>
                        <td>{user.smtp_host || '-'}</td>
                        <td>{user.smtp_user || '-'}</td>
                        <td>{new Date(user.createdat).toLocaleDateString()}</td>
                        <td>
                          <button className="action-btn edit"><i className="fas fa-edit"></i></button>
                          <button className="action-btn delete"><i className="fas fa-trash-alt"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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