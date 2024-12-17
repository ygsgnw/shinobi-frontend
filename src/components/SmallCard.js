import React from 'react';
import '../styles/smallCard.css';
import { Link } from 'react-router-dom';

const SmallCard = ({ anime }) => {
  if (!anime) return;
  const releaseDate = anime.status === 'NOT_YET_RELEASED'?
		(`${anime.startDate.day ? `${anime.startDate.day}/` : ''}${anime.startDate.month ? `${anime.startDate.month}/` : ''}${anime.startDate.year || 'NA'}`)
    : anime.startDate.year || 'NA';
	const episodes = `${anime.nextAiringEpisode ? `${anime.nextAiringEpisode.episode - 1}/` : ''}${anime.episodes || 'NA'}`;
	const duration = anime.duration ?
        (anime.duration < 60 ? `${anime.duration}M` : `${Math.floor(anime.duration / 60)}H ${Math.floor(anime.duration) % 60}M`)
        : 'NA';

  return (
    <Link className="small-card" to={`/watch/${anime.id}`} style={{ '--anime-color': anime.coverImage.color || 'gray' }}>
      <img className="small-card-image" src={anime.coverImage.medium} alt={anime.title.english || anime.title.romaji} />
      <div className="small-card-info">
        <div className="small-card-title">
          {anime.title.english || anime.title.romaji}
        </div>
        <div className="small-card-subtitle">
          <h6 className="small-card-subtitle-details">{anime.format || 'NA'}</h6>
          <h6 className="small-card-subtitle-details">{releaseDate}</h6>
          <h6 className="small-card-subtitle-details">EP - {episodes}</h6>
          <h6 className="small-card-subtitle-details">{duration}</h6>
          {anime.status === 'RELEASING' && <div className="small-card-subtitle-details small-card-airing">AIRING</div>}
          {/* {anime.status === 'NOT_YET_RELEASED' && <div className="small-card-subtitle-details small-card-upcoming">UPCOMING</div>} */}
        </div>
      </div>
    </Link>
  );
};

export default SmallCard;
