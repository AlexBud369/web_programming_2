import { useState, useEffect } from 'react';
import firstSlide from "../../images/home_page_person1.jpg";
import secondSlide from "../../images/home_page_person2.jpg"; 
import prevButton from "../../images/carousel-control-prev.svg";
import nextButton from "../../images/carousel-control-next.svg";


const slides = [
  { id: 1, image: firstSlide, title: "Summer Sale!" },
  { id: 2, image: secondSlide, title: "New Collection" },
];

function Slider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-slider">
        <button className="slider-arrow slider-prev" onClick={prevSlide}>
          <img src={prevButton} alt="Previous" />
        </button>

        <div className="slider-container">
          <img src={slides[current].image} alt={slides[current].title} className="slide-image" />
          <h2 className="slide-title">{slides[current].title}</h2>
        </div>

        <button className="slider-arrow slider-next" onClick={nextSlide}>
          <img src={nextButton} alt="Next" />
        </button>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === current ? 'active' : ''}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Slider;