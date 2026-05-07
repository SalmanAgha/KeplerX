import pool, { initializeDatabase } from './config/postgres';

const samplePortfolioItems = [
  {
    title: 'E-commerce Website',
    categories: ['web'],
    client: 'Fashion Store Inc.',
    description: 'A fully responsive e-commerce website with advanced features.',
    date: '2025-01-10',
    image: 'https://via.placeholder.com/300x200',
    images: ['https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600'],
    bgColor: '#045e63',
    testimonial: {
      text: "Our online presence has been completely transformed. The new website not only looks beautiful but has significantly improved our sales.",
      author: "Sarah Johnson",
      position: "Marketing Director, Fashion Store Inc."
    },
    whatWeDelivered: {
      description: 'Attractive Design, Optimized Site Speed, Advanced Security, Engaging Content, Responsive Website, Accessibility',
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
    date: '2025-02-15',
    image: 'https://via.placeholder.com/300x200',
    images: ['https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600'],
    bgColor: '#045e63',
    testimonial: {
      text: "The team delivered beyond our expectations. The new brand identity perfectly captures our company's vision.",
      author: "John Smith",
      position: "CEO, Tech Solutions LLC"
    },
    whatWeDelivered: {
      description: 'Attractive Design, Optimized Site Speed, Advanced Security, Engaging Content, Responsive Website, Accessibility',
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
    date: '2025-03-22',
    image: 'https://via.placeholder.com/300x200',
    images: ['https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600', 'https://via.placeholder.com/800x600'],
    bgColor: '#045e63',
    testimonial: {
      text: "The social media campaign exceeded our expectations. Our online presence has improved significantly.",
      author: "Emily Chen",
      position: "Marketing Manager, Organic Foods"
    },
    whatWeDelivered: {
      description: 'Attractive Design, Optimized Site Speed, Advanced Security, Engaging Content, Responsive Website, Accessibility',
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

const seedPostgres = async () => {
  try {
    await initializeDatabase();
    
    // Clear existing data
    await pool.execute('DELETE FROM portfolio');
    console.log('Cleared existing portfolio data');

    // Insert sample data
    for (const item of samplePortfolioItems) {
      await pool.execute(`
        INSERT INTO portfolio (
          title, description, client, date, categories, displayCategories,
          image, images, testimonial, whatWeDelivered, bgColor
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        item.title,
        item.description,
        item.client,
        item.date,
        JSON.stringify(item.categories),
        JSON.stringify(item.categories),
        item.image,
        JSON.stringify(item.images),
        JSON.stringify(item.testimonial),
        JSON.stringify(item.whatWeDelivered),
        item.bgColor
      ]);
    }
    
    console.log('Sample portfolio data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedPostgres();
