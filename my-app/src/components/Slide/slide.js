import { useState, useCallback } from 'react';
import styled from 'styled-components';
import firstSlide from "../../images/home_page_person1.jpg";
import secondSlide from "../../images/home_page_person2.jpg";
import prevButton from "../../images/carousel-control-prev.svg";
import nextButton from "../../images/carousel-control-next.svg";
import { Button } from '../UI/Button/Button';
import { media } from '../../styles/media';

const slides = [
  { id: 1, image: firstSlide, title: "Summer Sale!", subtitle: "Up to 50% off" },
  { id: 2, image: secondSlide, title: "New Collection", subtitle: "Discover latest trends" },
];

const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  margin-bottom: ${({ theme }) => theme.spacing[12]};
  
  ${media.tablet} {
    margin-bottom: ${({ theme }) => theme.spacing[8]};
  }
`;

const HeroSlider = styled.div`
  position: relative;
  height: 600px;
  
  ${media.laptop} { height: 500px; }
  ${media.tablet} { height: 400px; }
  ${media.mobile} { height: 300px; }
`;

const SlideContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  transition: opacity 0.6s ease-in-out;
`;

const SlideContent = styled.div`
  position: absolute;
  top: 50%;
  left: 25%; /* ← основное смещение */
  transform: translateY(-50%);
  max-width: 500px;
  z-index: 2;
  
  ${media.laptop} {
    left: 20%;
  }
  
  ${media.tablet} {
    left: 15%;
    max-width: 300px;
  }
  
  ${media.mobile} {
    left: ${({ theme }) => theme.spacing[4]};
    right: ${({ theme }) => theme.spacing[4]};
    max-width: 100%;
    text-align: center;
  }
`;

const SlideTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-family: ${({ theme }) => theme.fonts.heading};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  
  ${media.laptop} { font-size: ${({ theme }) => theme.fontSizes['3xl']}; }
  ${media.tablet} { font-size: ${({ theme }) => theme.fontSizes['2xl']}; }
  ${media.mobile} { font-size: ${({ theme }) => theme.fontSizes.xl}; }
`;

const SlideSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  font-family: ${({ theme }) => theme.fonts.main};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  opacity: 0.9;
  
  ${media.tablet} {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  ${media.mobile} { font-size: ${({ theme }) => theme.fontSizes.base}; }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  cursor: pointer;
  padding: 0;
  border: none;

  ${media.tablet} { width: 40px; height: 40px; }
  ${media.mobile} { width: 36px; height: 36px; }

  ${({ $prev, theme }) => $prev ? `
    left: ${theme.spacing[6]};
    ${media.mobile} { left: ${theme.spacing[2]}; }
  ` : `
    right: ${theme.spacing[6]};
    ${media.mobile} { right: ${theme.spacing[2]}; }
  `}

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ArrowIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
  ${media.tablet} { width: 16px; height: 16px; }
`;

export default function Slider() {
  const [current, setCurrent] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  return (
    <HeroSection>
      <HeroSlider>
        <SlideContainer>
          {slides.map((slide, index) => (
            <SlideImage
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              $isActive={index === current}
            />
          ))}
          
          <SlideContent>
            <SlideTitle>{slides[current].title}</SlideTitle>
            <SlideSubtitle>{slides[current].subtitle}</SlideSubtitle>
          </SlideContent>
        </SlideContainer>

        <ArrowButton $prev onClick={prevSlide} aria-label="Previous slide">
          <ArrowIcon src={prevButton} alt="Previous" />
        </ArrowButton>

        <ArrowButton onClick={nextSlide} aria-label="Next slide">
          <ArrowIcon src={nextButton} alt="Next" />
        </ArrowButton>
      </HeroSlider>
    </HeroSection>
  );
}