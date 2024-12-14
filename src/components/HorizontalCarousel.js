import React, { useEffect, useRef, useState } from 'react';
import '../styles/horizontalCarousel.css';
import ColumnCard from '../components/ColumnCard';
import BigCard from './BigCard';

const HorizontalCarousel = ({ heading, animeList, carouselId }) => {
  
  const scrollableRef = useRef(null);
  const leftBututonRef = useRef(null);
  const rightBututonRef = useRef(null);

  useEffect(() => {
    const scrollableElement = scrollableRef.current;
    const leftButton = leftBututonRef.current;
    const rightButton = rightBututonRef.current;
    
    const updateButtonState = () => {
      const maxScrollRight = scrollableElement.scrollWidth - scrollableElement.clientWidth;
      leftButton.style.visibility = scrollableElement.scrollLeft <= 0 ? 'hidden' : 'visible';
      rightButton.style.visibility = scrollableElement.scrollLeft >= maxScrollRight-1 ? 'hidden' : 'visible';
    };

    updateButtonState();
    scrollableElement.addEventListener('scroll', updateButtonState);
    window.addEventListener('resize', updateButtonState);

    return () => {
      scrollableElement.removeEventListener('scroll', updateButtonState);
      window.removeEventListener('resize', updateButtonState);
    };
  }, []);

  const scrollByAmount = (amount) => {
    scrollableRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <>
      <div className="h-heading">{heading}</div>
      {/* <hr/> */}
      <div className="h-carousel">
        <div className="h-button" ref={leftBututonRef} onClick={() => scrollByAmount(-1468.2)} >
          <svg width="30px" viewBox="7 6 20 20">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </div>
        <div className="h-scrollable" ref={scrollableRef}>

          {carouselId==='anime' && 
            animeList.map((anime, index) => (
              <div className="h-card-wrapper" key={index}>
                <BigCard anime={anime} />
              </div>
            ))
          }

          {carouselId==='relations' && 
            animeList.map((anime, index) => (
              anime.node.format !== 'MANGA' &&
              anime.node.format !== 'NOVEL' &&
              anime.node.format !== 'ONE_SHOT' &&
              (<div className="h-card-wrapper" key={index}>
                <BigCard anime={anime.node} relation={anime.relationType} />
              </div> )
            ))
          }

          {carouselId==='recommendations' && 
            animeList.map((anime, index) => (
              <div className="h-card-wrapper" key={index}>
                <BigCard anime={anime.node.mediaRecommendation} />
              </div>
            ))
          }

        </div>
        <div className="h-button" ref={rightBututonRef} onClick={() => scrollByAmount(1468.2)} >
          <svg width="30px" viewBox="0 0 20 20">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default HorizontalCarousel;
