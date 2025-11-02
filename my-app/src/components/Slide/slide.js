import { useState, useEffect } from 'react';

const slides = [
  { id: 1, image: "/images/spec/home_page_person1.jpg", title: "Summer Sale!" },
  { id: 2, image: "/images/spec/home_page_person2.jpg", title: "New Collection" },
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
            <img src="images/spec/carousel-control-prev.svg" alt="Previous" />
          </button>

          <div className="slider-container">
            <img src={slides[current].image} alt={slides[current].title} className="slide-image" />
            <h2 className="slide-title">{slides[current].title}</h2>
          </div>

          <button className="slider-arrow slider-next" onClick={nextSlide}>
            <img src="images/spec/carousel-control-next.svg" alt="Next" />
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