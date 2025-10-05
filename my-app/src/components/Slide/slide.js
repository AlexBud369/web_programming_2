import React from 'react';
import firstSlide from "../../images/home_page_person1.jpg";
import prevButton from "../../images/carousel-control-prev.svg";
import nextButton from "../../images/carousel-control-next.svg";

class Slide extends React.Component {
    render(){
        return (
            <section className="hero">
                <div className="hero-slider">
                    <button className="slider-arrow slider-prev">
                        <img src={prevButton} alt="Previous"/>
                    </button>
                    <div className="slider-container">
                        <div className="hero-images">
                            <img src={firstSlide} alt="first_slide"/>
                        </div>
                        <div className="slider-progress">
                            <div className="progress-bar"></div>
                        </div>
                    </div>
                    <button className="slider-arrow slider-next">
                        <img src={nextButton} alt="Next"/>
                    </button>
                </div>
            </section>
        );
    }
}

export default Slide;