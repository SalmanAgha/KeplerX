import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Testimonials.css';

const Testimonials: React.FC = () => {
  // Replaced dummy data with real testimonials
  const testimonials = [
    {
      logo: "/images/friends.webp",
      websiteName: "Friends Marketing",
      serviceName: "Web Development",
      description: "The website KeplerX designed for us is a game-changer. It’s fast, intuitive, and perfectly aligned with our brand.",
      rating: "★★★★★",
    },
    {
      logo: "/images/baraat.webp",
      websiteName: "Baraat Catering ",
      serviceName: "SEO",
      description: "KeplerX’s SEO strategies took us from page three to the top of Google search results, drastically increasing our organic traffic.",
      rating: "★★★★★",
    },
    {
      logo: "/images/skyblue.webp",
      websiteName: "SkyBlue Immigration",
      serviceName: "Web Development",
      description: "Our new website by KeplerX is not just beautiful, but it’s also optimized for mobile and delivers a seamless user experience.",
      rating: "★★★★★",
    },
    {
      logo: "/images/techmender.png",
      websiteName: "Tech Mender",
      serviceName: "Web Development",
      description: "KeplerX’s social media campaigns are spot-on. They’ve helped us connect with our audience in a way we never could before.",
      rating: "★★★★★",
    },
    {
      logo: "/images/canvas.webp",
      websiteName: "The Canvas Farm",
      serviceName: "SEO",
      description: "KeplerX took our SEO to the next level, boosting our site’s visibility and driving more qualified leads than ever.",
      rating: "★★★★★",
    },
    {
      logo: "/images/taj.png",
      websiteName: "Taj Gasoline",
      serviceName: "Web Development",
      description: "KeplerX built us a sleek, user-friendly website that not only looks great but has significantly improved our conversion rates.",
      rating: "★★★★★",
    },
    {
      logo: "/images/dedu.webp",
      websiteName: "Deducationist",
      serviceName: "Social Media Marketing",
      description: "Thanks to KeplerX’s social media expertise, our engagement has soared, and our follower count has grown by 50% in just two months.",
      rating: "★★★★★",
    },
    
  ];

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