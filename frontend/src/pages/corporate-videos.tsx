import React from 'react';
import './corporate-videos.css';
import Breadcrumb from '../components/Breadcrumb';


const AIServices: React.FC = () => {
  return (
    <>
      <Breadcrumb 
        title="AI Services" 
        path={['Home', 'Services', 'AI Services']} 
      />
      
      <section className="corporate-videos-section">
        <div className="">
          <div className="corporate-videos-intro">
            <h2>AI Services</h2>
            <p>
              Harness the power of Artificial Intelligence to transform your business operations and accelerate growth. Our comprehensive AI services include custom AI solutions, machine learning models, natural language processing, computer vision, intelligent automation, and AI consulting. From concept to deployment, we help businesses leverage cutting-edge AI technologies to enhance efficiency, improve decision-making, and create innovative customer experiences.
            </p>
          </div>
          
          <div className="corporate-videos-services-grid">
            <div className="corporate-videos-card">
              <img src="/images/machine-learning.webp" alt="Machine Learning Solutions" />
              <h3>Machine Learning Solutions</h3>
              <p>Custom ML models that learn from your data to predict trends, automate decisions, and provide intelligent insights for your business operations.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/nlp-services.webp" alt="Natural Language Processing" />
              <h3>Natural Language Processing</h3>
              <p>Advanced NLP solutions including chatbots, sentiment analysis, text summarization, and language translation services to enhance communication.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/computer-vision.webp" alt="Computer Vision" />
              <h3>Computer Vision</h3>
              <p>AI-powered image and video analysis, object detection, facial recognition, and visual quality inspection systems for various industries.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/ai-automation.webp" alt="AI Process Automation" />
              <h3>AI Process Automation</h3>
              <p>Intelligent automation solutions that streamline workflows, reduce manual tasks, and optimize business processes using AI technologies.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/predictive-analytics.webp" alt="Predictive Analytics" />
              <h3>Predictive Analytics</h3>
              <p>Advanced analytics powered by AI to forecast market trends, customer behavior, and business outcomes for strategic planning.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/ai-chatbots.webp" alt="AI Chatbots & Virtual Assistants" />
              <h3>AI Chatbots & Virtual Assistants</h3>
              <p>Intelligent conversational AI systems that provide 24/7 customer support, handle inquiries, and enhance user engagement.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/recommendation-systems.webp" alt="Recommendation Systems" />
              <h3>Recommendation Systems</h3>
              <p>Personalized recommendation engines that enhance user experience and drive sales through intelligent product and content suggestions.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/ai-consulting.webp" alt="AI Strategy Consulting" />
              <h3>AI Strategy Consulting</h3>
              <p>Expert guidance on AI adoption, technology selection, implementation roadmaps, and digital transformation strategies.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/deep-learning.webp" alt="Deep Learning Solutions" />
              <h3>Deep Learning Solutions</h3>
              <p>Advanced neural network solutions for complex pattern recognition, image processing, and sophisticated AI applications.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/ai-integration.webp" alt="AI Integration Services" />
              <h3>AI Integration Services</h3>
              <p>Seamless integration of AI solutions with existing systems, APIs, and business workflows for enhanced functionality.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/ai-training.webp" alt="AI Model Training" />
              <h3>AI Model Training & Optimization</h3>
              <p>Custom model training, fine-tuning, and optimization services to ensure peak performance and accuracy for your specific use cases.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/ai-ethics.webp" alt="Ethical AI Development" />
              <h3>Ethical AI Development</h3>
              <p>Responsible AI development focusing on fairness, transparency, privacy, and ethical considerations in AI system design.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/ai-cloud.webp" alt="AI Cloud Solutions" />
              <h3>AI Cloud Solutions</h3>
              <p>Scalable cloud-based AI infrastructure, model deployment, and managed AI services for enterprise-grade applications.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/ai-analytics.webp" alt="AI-Powered Data Analytics" />
              <h3>AI-Powered Data Analytics</h3>
              <p>Advanced data analysis using AI algorithms to extract actionable insights, patterns, and intelligence from complex datasets.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/ai-maintenance.webp" alt="AI System Maintenance" />
              <h3>AI System Maintenance</h3>
              <p>Ongoing monitoring, maintenance, and updates for AI systems to ensure optimal performance and continuous improvement.</p>
            </div>
            
            <div className="corporate-videos-card">
              <img src="/images/custom-ai.webp" alt="Custom AI Development" />
              <h3>Custom AI Development</h3>
              <p>Tailored AI solutions designed specifically for your business needs, industry requirements, and unique challenges.</p>
            </div>
          </div>
          
          
        </div>
      </section>
    </>
  );
};

export default AIServices;
