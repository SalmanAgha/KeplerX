import mongoose from 'mongoose';

const enquiryFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: false
  },
  service: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded'],
    default: 'new'
  }
});

export default mongoose.model('EnquiryForm', enquiryFormSchema); 