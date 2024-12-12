import React from 'react';
import '../styles/bigCard.css';
import { Link } from 'react-router-dom';

const BigCard = ({ anime, relation }) => {
	if (!anime) return;

	const releaseDate = anime.status === 'NOT_YET_RELEASED'?
		(`${anime.startDate.day ? `${anime.startDate.day}/` : ''}${anime.startDate.month ? `${anime.startDate.month}/` : ''}${anime.startDate.year || 'NA'}`)
    : anime.startDate.year || 'NA';
	const episodes = `${anime.nextAiringEpisode ? `${anime.nextAiringEpisode.episode - 1}/` : ''}${anime.episodes || 'NA'}`;
	const duration = anime.duration ?
        (anime.duration < 60 ? `${anime.duration}M` : `${Math.floor(anime.duration / 60)}H ${Math.floor(anime.duration) % 60}M`)
        : 'NA';

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	return (
		<Link className="big-card" to={`/watch/${anime.id}`} style={{ '--anime-color': anime.coverImage.color || 'gray' }} onClick={scrollToTop}>
			<img className="big-card-image" src={anime.coverImage.large} alt={anime.title.english || anime.title.romaji}/>
			{relation && <div className="big-card-relation big-card-badges"> {relation} </div>}
			<div className="big-card-info">
				<div className="big-card-title" title> {anime.title.english || anime.title.romaji} </div>
				<div className="big-card-subtitle">
					<h6 className="big-card-subtitle-details"> {anime.format || 'NA'} </h6>
					<h6 className="big-card-subtitle-details"> {releaseDate} </h6>
					<h6 className="big-card-subtitle-details"> EP - {episodes} </h6>
					<h6 className="big-card-subtitle-details"> DURATION - {duration} </h6>
					{anime.status === 'RELEASING' && <div className="big-card-airing big-card-badges">AIRING</div>}
					{anime.status === 'NOT_YET_RELEASED' && <div className="big-card-upcoming big-card-badges">UPCOMING</div>}
				</div>
			</div>
  		</Link>
	);
};

export default BigCard;
