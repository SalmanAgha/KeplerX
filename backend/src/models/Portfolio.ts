import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  categories: {
    type: [String],
    required: true
  },
  client: String,
  description: String,
  challenge: String,
  solution: String,
  results: String,
  completionDate: Date,
  technologies: String,
  testimonial: {
    text: String,
    author: String,
    position: String
  },
  image: String,
  images: [String],
  bgColor: {
    type: String,
    default: '#045e63'
  },
  whatWeDelivered: {
    description: String,
    items: [{
      title: String,
      icon: String
    }]
  }
}, {
  timestamps: true
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio; 