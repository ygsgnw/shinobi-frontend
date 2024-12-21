import React, { useEffect, useRef } from 'react';
import '../styles/verticalCarousel.css'; 
import SmallCard from '../components/SmallCard'; 

const VerticalCarousel = ({ animeList, heading }) => {
  const scrollableRef = useRef(null);
  const upButtonRef = useRef(null);
  const downButtonRef = useRef(null);

  useEffect(() => {
    const scrollableElement = scrollableRef.current;
    const upButton = upButtonRef.current;
    const downButton = downButtonRef.current;

    const updateButtonState = () => {
      const maxScrollDown = scrollableElement.scrollHeight - scrollableElement.clientHeight;
      upButton.style.visibility = scrollableElement.scrollTop <= 0 ? 'hidden' : 'visible';
      downButton.style.visibility = scrollableElement.scrollTop >= maxScrollDown ? 'hidden' : 'visible';
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
    scrollableRef.current.scrollBy({ top: amount, behavior: 'smooth' });
  };

  return (
    <div className="v-carousel">
      <div className="v-header">
        <h2 className="v-heading">{heading}</h2>
        <div className="v-button" ref={upButtonRef} onClick={() => scrollByAmount(-500)}>
          <svg viewBox="0 0 24 24">
            <path d="M12 8l6 6-1.41 1.41L12 10.83l-4.59 4.58L6 14z" />
          </svg>
        </div>
      </div>
      <div className="v-scrollable" ref={scrollableRef}>
        {animeList.map((anime, index) => (
          <div className="v-card-wrapper" key={index}>
            <SmallCard anime={anime} />
          </div>
        ))}
      </div>
      <div className="v-button" ref={downButtonRef} onClick={() => scrollByAmount(500)}>
        <svg viewBox="0 0 24 24">
          <path d="M12 16l-6-6 1.41-1.41L12 13.17l4.59-4.58L18 10z" />
        </svg>
      </div>
    </div>
  );
};

export default VerticalCarousel;
