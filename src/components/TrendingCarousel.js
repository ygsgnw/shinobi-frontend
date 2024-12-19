import React, { useState, useEffect, useRef } from 'react';
import '../styles/trendingCarousel.css';
import { Link } from 'react-router-dom';

const TrendingCarousel = ({ animeList }) => {
    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    // Function to start the carousel
    const startCarousel = () => {
        stopCarousel(); // Clear any existing intervals
        intervalRef.current = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % animeList.length);
        }, 3000);
    };

    // Function to stop the carousel
    const stopCarousel = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    // Update index manually and restart carousel
    const goToSlide = (newIndex) => {
        setIndex(newIndex);
        startCarousel();
    };

    // useEffect to start the carousel on mount and clean up on unmount
    useEffect(() => {
        startCarousel();
        return () => stopCarousel(); // Cleanup on unmount
    }, []);

    return (
        <>
        <div 
            className="t-carousel" 
            id="t-carousel"
            onMouseEnter={stopCarousel} 
            onMouseLeave={startCarousel}
        >
            {animeList.map((anime, idx ) => { 
                const releaseDate = anime.status === 'NOT_YET_RELEASED'?
                (`${anime.startDate.day ? `${anime.startDate.day}/` : ''}${anime.startDate.month ? `${anime.startDate.month}/` : ''}${anime.startDate.year || 'NA'}`)
                : anime.startDate.year || 'NA';
                const episodes = `${anime.nextAiringEpisode ? `${anime.nextAiringEpisode.episode - 1}/` : ''}${anime.episodes || 'NA'}`;
                const duration = anime.duration ?
                    (anime.duration < 60 ? `${anime.duration}M` : `${Math.floor(anime.duration / 60)}H ${Math.floor(anime.duration) % 60}M`)
                    : 'NA';

                return (
                <div
                    className="t-slide"
                    key={anime.id}
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    <img src={anime.bannerImage} alt={`Slide ${idx + 1}`} />
                    <div className="t-trending-tag">Trending #{idx + 1}</div>
                    <div className="t-slide-info">
                        <div
                            className="t-title"
                            style={{ '--anime-color': anime.coverImage.color || 'gray' }}
                        >
                            {anime.title.english || anime.title.romaji}
                        </div>
                        <div className="t-subtitle">
                            <div className="t-subtitle-details"> {anime.format || 'NA'} </div>
                            <div className="t-subtitle-details"> {releaseDate} </div>
                            <div className="t-subtitle-details">  EP - {episodes} </div>
                            <div className="t-subtitle-details"> DURATION - {duration} </div>
                            {anime.status === 'RELEASING' && <div className="t-subtitle-details t-airing">AIRING</div>}
                            {anime.status === 'NOT_YET_RELEASED' && <div className="t-subtitle-details t-upcoming">UPCOMING</div>}
                        </div>
                        {anime.description && (
                            <div className="t-desc" dangerouslySetInnerHTML={{ __html: anime.description }} />
                        )}
                    </div>
                    <Link to={`/watch/${anime.id}`} className="t-watch-button">WATCH NOW</Link>
                </div>)
            })}
        </div>
        <div>
            <div className="t-carousel-indicators">
                {animeList.map((anime, i) => (
                    <span
                        key={i}
                        className={`t-indicator ${i === index ? 'active' : ''}`}
                        data-slide={i}
                        onClick={() => goToSlide(i)}
                    />
                ))}
            </div>
        </div>
        </>
    );
};

export default TrendingCarousel;
