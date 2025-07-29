import Portfolio from '../models/Portfolio';
import mongoose from 'mongoose';

const samplePortfolioItems = [
  {
    title: 'E-commerce Website',
    categories: ['web'],
    client: 'Fashion Store Inc.',
    description: 'A fully responsive e-commerce website with advanced features.',
    challenge: 'The client needed a modern e-commerce website that would provide an exceptional user experience while handling a large inventory of products.',
    solution: 'We designed and developed a responsive e-commerce platform with advanced filtering, search functionality, and a streamlined checkout process.',
    results: 'The new website increased online sales by 78% and reduced cart abandonment rates by 35%.',
    completionDate: new Date('2025-01-10'),
    technologies: 'React, Node.js, MongoDB, Stripe',
    testimonial: {
      text: "Our online presence has been completely transformed. The new website not only looks beautiful but has significantly improved our sales.",
      author: "Sarah Johnson",
      position: "Marketing Director, Fashion Store Inc."
    },
    image: 'https://via.placeholder.com/300x200',
    images: ['https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600'],
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
  },
  {
    title: 'Brand Identity',
    categories: ['graphic'],
    client: 'Tech Solutions LLC',
    description: 'A complete brand identity including logo, colors, and brand guidelines.',
    challenge: 'The client needed a complete brand identity that would stand out in a competitive market.',
    solution: 'We developed a comprehensive brand identity system including logo design, color palette, typography, and brand guidelines.',
    results: 'The new brand identity helped the client increase brand recognition by 45% within the first six months.',
    completionDate: new Date('2025-02-15'),
    technologies: 'Adobe Illustrator, Adobe Photoshop, Figma',
    testimonial: {
      text: "The team delivered beyond our expectations. The new brand identity perfectly captures our company's vision.",
      author: "John Smith",
      position: "CEO, Tech Solutions LLC"
    },
    image: 'https://via.placeholder.com/300x200',
    images: ['https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600'],
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
  },
  {
    title: 'Social Media Campaign',
    categories: ['social-marketing'],
    client: 'Organic Foods',
    description: 'A comprehensive social media campaign to increase brand awareness.',
    challenge: 'The client needed to increase brand awareness and engagement on social media platforms.',
    solution: 'We developed a strategic social media campaign with targeted content and paid advertising.',
    results: 'The campaign resulted in a 120% increase in engagement and a 45% increase in website traffic.',
    completionDate: new Date('2025-03-22'),
    technologies: 'Facebook Ads, Instagram, Twitter, LinkedIn',
    testimonial: {
      text: "The social media campaign exceeded our expectations. Our online presence has improved significantly.",
      author: "Emily Chen",
      position: "Marketing Manager, Organic Foods"
    },
    image: 'https://via.placeholder.com/300x200',
    images: ['https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600'],
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
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Portfolio.deleteMany({});
    console.log('Cleared existing portfolio data');

    // Insert sample data
    await Portfolio.insertMany(samplePortfolioItems);
    console.log('Sample portfolio data inserted successfully');
    
    // Disconnect from database
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase }; 