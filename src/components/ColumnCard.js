import React from 'react';
import '../styles/columnCard.css';
import { Link } from 'react-router-dom';

const ColumnCard = ({ anime, relation }) => {
  if(!anime)return ;
  const animeColor = anime?.coverImage?.color || 'grey';
  const animeTitle = anime.title.english ? anime.title.english : anime.title.romaji;
  const animeFormat = anime.format ? anime.format : 'NA';
  const episodeInfo = anime.format === 'MOVIE' || anime.format === 'MUSIC' 
    ? anime.duration 
      ? `${Math.floor(anime.duration / 60)}h ${Math.floor(anime.duration) % 60}m` 
      : 'NA'
    : anime.status === 'RELEASING'
      ? `EP-${anime.nextAiringEpisode ? anime.nextAiringEpisode.episode - 1 : 'NA'}`
      : anime.episodes
        ? `EP-${anime.episodes}`
        : 'NA';
  const releaseDate = anime.status === 'NOT_YET_RELEASED' && anime.startDate
    ? `${anime.startDate.day ? `${anime.startDate.day}/` : ''}${anime.startDate.month ? `${anime.startDate.month}/` : ''}${anime.startDate.year ? anime.startDate.year : 'NA'}`
    : anime.seasonYear;

    const scrollToTop = () => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });
    }

  return (
    <Link className="c-card" to={`/watch/${anime.id}`} style={{ '--anime-color': animeColor }} onClick={scrollToTop}>
      <div className="c-card-image-airing">
        <img src={anime.coverImage.large} className="c-card-image" alt={animeTitle} />

        {anime.status === 'RELEASING' && <div className="c-card-airing">AIRING</div>}
        {relation && <div className="c-card-relation">{relation}</div>}
      </div>
      <div className="c-card-title-info">
        <div className="c-card-title">{animeTitle}</div>
        <div className="c-card-title-details">
          <h5>{anime.title.english}</h5>
          <h5>{anime.title.romaji}</h5>
        </div>
      </div>
      <div className="c-card-subtitle">
        <h6 className="c-card-subtitle-details">{animeFormat}</h6>
        <h6 className="c-card-subtitle-details">{episodeInfo}</h6>
        <h6 className="c-card-subtitle-details">{releaseDate}</h6>
      </div>
    </Link>
  );
};

export default ColumnCard;
