import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Testimonials.css';

const Testimonials: React.FC = () => {
  const testimonials = Array.from({ length: 8 }, (_, index) => ({
    logo: `/path/to/logo${index + 1}.png`,
    websiteName: `Website Name ${index + 1}`,
    serviceName: 'Service Name',
    description: `This is a description of the testimonial for client ${index + 1}.`,
    rating: '★★★★★',
  }));

  const [settings, setSettings] = useState({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: window.innerWidth < 768 ? 1 : 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    draggable: true,
  });

  useEffect(() => {
    const updateSlidesToShow = () => {
      setSettings((prevSettings) => ({
        ...prevSettings,
        slidesToShow: window.innerWidth < 768 ? 1 : 4,
      }));
    };

    window.addEventListener('resize', updateSlidesToShow);
    return () => {
      window.removeEventListener('resize', updateSlidesToShow);
    };
  }, []);

  return (
    <section className="testimonials ">
      <h2 className="testimonials-title">What Our Happy Clients Say About Us</h2>
      <Slider {...settings} className="testimonials-slider">
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <img src={testimonial.logo} alt={`Client ${index + 1} Logo`} className="testimonial-logo" />
            <h3>{testimonial.websiteName}</h3>
            <h4>{testimonial.serviceName}</h4>
            <p>{testimonial.description}</p>
            <div className="testimonial-rating">{testimonial.rating}</div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Testimonials; 