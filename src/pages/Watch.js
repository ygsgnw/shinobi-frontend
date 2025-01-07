import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimeDetails from "../components/AnimeDetails";
import VideoJS from "../components/VideoJS";
import '../styles/watch.css';
import { fetchAnimeDetails } from "../services/fetchAnimeDetails";

// 0 -> loading
// 10 -> error
// 1-9 -> other states for choosing component rendering

const Watch = () => {

    const backendApiUrl = process.env.REACT_APP_API_URL;

    const params = useParams();
    const anilistId = params.anilistId;
    console.log(anilistId);

    const [pageLoading, setPageLoading] = useState(0);
    const [episodesListLoading, setEpisodesListLoading] = useState(0);
    const [serversListLoading, setServersListLoading] = useState(1);
    const [animeDetails, setAnimeDetails] = useState();
    const [hianimeId, setHianimeId] = useState();
    const [episodesList, setEpisodesList] = useState();
    const [selectedRange, setSelectedRange] = useState(0);
    const [currentEpisode, setCurrentEpisode] = useState(0);
    const [serversList, setServersList] = useState();
    const [currentServer, setCurrentServer] = useState();
    const [source, setSource] = useState();
    const [episodeLoading, setEpisodeLoading] = useState(1);

    useEffect(() => {
        setPageLoading(0);
        setEpisodesListLoading(0);
        setServersListLoading(1);
        setSelectedRange(0);
        setEpisodeLoading(1);
        setCurrentEpisode(0);
    }, [anilistId])
    
    useEffect(() => {
        const fetchWatch = async () => {
            let data;
            let err = false;
            const cache = sessionStorage.getItem(anilistId)
            if(cache){
                console.log(`animeDetails found for: ${anilistId}`);
                console.log(cache);
                data = JSON.parse(cache);
            }
            else{
                try{
                    data = await fetchAnimeDetails(anilistId);
                    console.log(data);
                    sessionStorage.setItem(anilistId, JSON.stringify(data));
                }
                catch(error){
                    // console.log('error');
                    err = true;
                }
            }
            // console.log(err);
            if(err){
                setPageLoading(10);
            }
            else{
                setAnimeDetails(data);
                setPageLoading(1);
            }
        }
        fetchWatch();
    }, [anilistId])

    useEffect(() => {
        if (animeDetails && animeDetails.status !== 'NOT_YET_RELEASED') {
            const fetchHianimeId = async () => {
                let data;
                let err = false;
                const cache = sessionStorage.getItem(`${animeDetails.title.romaji}-titleForHianimeId`);
                if(cache){
                    console.log(`hianimeId found for: ${animeDetails.title.romaji}-titleForHianimeId`);
                    console.log(cache);
                    data = JSON.parse(cache);
                }
                else{
                    try{
                        console.log(animeDetails.title.romaji, animeDetails.startDate.year-1, animeDetails.startDate.year+1, animeDetails.nextAiringEpisode ? animeDetails.nextAiringEpisode.episode - 1 : animeDetails.episodes, animeDetails.format==='MOVIE' ? 'Movie' : animeDetails.format)
                        const response = await fetch(`${backendApiUrl}/search`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "animeTitle": animeDetails.title.romaji,
                                "leftYear": animeDetails.startDate.year-1,
                                "rightYear": animeDetails.startDate.year+1,
                                "episodes": animeDetails.nextAiringEpisode ? animeDetails.nextAiringEpisode.episode - 1 : animeDetails.episodes,
                                "format": animeDetails.format==='MOVIE' ? 'Movie' : animeDetails.format
                            })
                        })
                        data = await response.json();

                        if(!response.ok){
                            throw data;
                        }
                        else{
                            console.log(data);
                            sessionStorage.setItem(`${animeDetails.title.romaji}-titleForHianimeId`, JSON.stringify(data));
                        }
                    }
                    catch(error){
                        console.error(error);
                        err = true;
                    }
                }

                if(err){
                    setEpisodesListLoading(10);
                }
                else{
                    setHianimeId(data.animeId);
                }
            };
            fetchHianimeId();
        }
    }, [animeDetails]);

    useEffect(() => {
        if(hianimeId){
            const fetchEpisodesList = async () => {
                let data;
                let err = false;
                const cache = sessionStorage.getItem(`${hianimeId}-hianimeId`);
                if(cache){
                    console.log(`episodesList found for: ${hianimeId}-hianimeId`);
                    console.log(cache);
                    data = JSON.parse(cache);
                }
                else{
                    try{
                        const response = await fetch(`${backendApiUrl}/episodesList/${hianimeId}`)
                        data = await response.json();

                        if(!response.ok){
                            throw data;
                        }
                        else{
                            console.log(data);
                            sessionStorage.setItem(`${hianimeId}-hianimeId`, JSON.stringify(data));
                        }
                    }
                    catch(error){
                        console.error(error);
                        err = true;
                    }
                }

                if(err){
                    setEpisodesListLoading(10);
                }
                else{
                    let el=[];
                    const n = data.length;
                    for(let i=1; i<=n; i+=100){
                        const l=i;
                        const r=Math.min(i+99, n);
                    
                        let array=[];
                        for(let j=l; j<=r; j++){
                        array.push({number: j, id: data[j-1].id});
                        }
                    
                        el.push({range: `${l} - ${r}`, ids: array});
                    }
                    setEpisodesList(el);
                    setEpisodesListLoading(1);
                }
            };
            fetchEpisodesList();
        }
    }, [hianimeId]);

    const handleEpisodeClick = useCallback((episodeId, number) => {
        console.log(`episode clicked: ${episodeId}`);
        setEpisodeLoading(1);
        setServersListLoading(0);
        setCurrentEpisode(number);

        const episodeIdParts = episodeId.split('=');
        const episodeIdData = episodeIdParts[episodeIdParts.length-1];

        const fetchServersList = async () => {
            let data;
            let err = false;
            const cache = sessionStorage.getItem(`${episodeId}-episodeId`);
            if(cache){
                console.log(`serversList found for: ${episodeId}-episodeId`);
                console.log(cache);
                data = JSON.parse(cache);
            }
            else{
                try{
                    const response = await fetch(`${backendApiUrl}/serversList/${episodeIdData}`)
                    data = await response.json();

                    if(!response.ok){
                        throw data;
                    }
                    else{
                        console.log(data);
                        sessionStorage.setItem(`${episodeId}-episodeId`, JSON.stringify(data));
                    }
                }
                catch(error){
                    console.error(error);
                    err = true;
                }
            }

            if(err){
                setServersListLoading(10);
            }
            else{
                setServersList(data.serversListSub);
                setServersListLoading(2);
            }
        }
        fetchServersList();
    }, []);

    useEffect(() => {
        if (serversList) {
            handleServerClick(serversList[0].srcId, serversList[0].serverName);
        }
    }, [serversList])

    const handleServerClick = useCallback((srcId, serverName) => {
        console.log(`server clicked: ${serverName}`);
        setEpisodeLoading(0);
        setCurrentServer(serverName);

        const fetchSource = async () => {
            let data;
            let err = false;
            const cache = sessionStorage.getItem(`${srcId}-srcId`);
            if(cache){
                console.log(`source data found for: ${srcId}-srcId`);
                console.log(cache);
                data = JSON.parse(cache);
            }
            else{
                try{
                    const response = await fetch(`${backendApiUrl}/sourceLink/${srcId}`)
                    data = await response.json();

                    if(!response.ok){
                        throw data;
                    }
                    else{
                        console.log(data);
                        sessionStorage.setItem(`${srcId}-srcId`, JSON.stringify(data));
                    }
                }
                catch(error){
                    console.error(error);
                    err = true;
                }
            }

            if(err){
                setEpisodeLoading(10);
            }
            else{
                console.log('updating source')
                setSource(data);
                // reason of this setTimeout - react updates state in batches so episodeLoading(0) was not getting exectued in case of cache hit and there was no change in server.
                setTimeout(() => {
                    setEpisodeLoading(2);
                }, 100);
            }
        }
        fetchSource();
    }, []);

    useEffect(() => {
        console.log('source changed: ',source);
    }, [source])

    if (pageLoading===10) return <h2 style={{ marginLeft: '30px', color: 'white' }}>Failed to load watch page</h2>;
    if (pageLoading===0) {
        return <h2 style={{ marginLeft: '30px', color: 'white' }}>Loading watch page ...</h2>;
    }
    return (
        <>
            {animeDetails.status !== 'NOT_YET_RELEASED' && (
                <div className="watch-section">
                    <div className="episodes-container">
                        {episodesListLoading===10 && 
                            <div className="episodes-list-error">
                                Failed to fetch Episodes List (Refresh Page)
                            </div>
                        }

                        {episodesListLoading===0 && <EpisodesListLoader />}

                        {episodesListLoading===1 && (
                            <EpisodesContainer
                                episodesList={episodesList}
                                selectedRange={selectedRange}
                                currentEpisode={currentEpisode}
                                setSelectedRange={setSelectedRange}
                                handleEpisodeClick={handleEpisodeClick}
                            />
                        )}

                    </div>

                    <VideoPlayer
                        serversList={serversList}
                        currentServer={currentServer}
                        serversListLoading={serversListLoading}
                        handleServerClick={handleServerClick}
                        source={source}
                        poster={animeDetails.bannerImage}
                        episodeLoading={episodeLoading}
                    />
                </div>
            )}
            <AnimeDetails anime={animeDetails} />
        </>
    );
}

const EpisodesContainer = ({ episodesList, setSelectedRange, selectedRange, currentEpisode, handleEpisodeClick }) => (
    <>
        <div className="episodes-info">
            <select
                id="episodes-division"
                className="episodes-division"
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
            >
                {episodesList.map((divi, index) => (
                    <option key={index} value={index}>
                        Episodes {divi.range}
                    </option>
                ))}
            </select>
        </div>

        <div className="episodes-list">
            {episodesList[selectedRange]?.ids.map((episode) => (
                <button
                    key={episode.id}
                    className={`episodes-button ${currentEpisode === episode.number ? 'active' : ''}`}
                    onClick={() => handleEpisodeClick(episode.id, episode.number)}
                // disabled={on clicking on an epiisode make other buttons disable}
                >
                    {episode.number}
                </button>
            ))}
        </div>
    </>
);

const EpisodesListLoader = React.memo(() => (
    <div className="loader">
        {console.log('l')}
        <svg
            className="container"
            x="0px"
            y="0px"
            viewBox="0 0 50 31.25"
            height="31.25"
            width="50"
            preserveAspectRatio="xMidYMid meet"
        >
            <path
                className="track"
                strokeWidth="4"
                fill="none"
                pathLength="100"
                d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"
            />
            <path
                className="car"
                strokeWidth="4"
                fill="none"
                pathLength="100"
                d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"
            />
        </svg>
    </div>
));

const VideoPlayer = ({ serversList, currentServer, handleServerClick, serversListLoading, source, poster, episodeLoading }) => {

    const videoJsOptions = {
        autoplay: false,
        controls: true,
        preload: "auto",
        aspectRatio: "16:9",
        poster: poster,
        height: 900,
        width: 500,
        sources: [{
            src: source ? source.sources[0].url : '',
            type: 'application/x-mpegURL'
        }],
        tracks: source ?
            source.tracks.map((track) => (track.kind !=='thumbnails' &&
                {
                    src: track.file,
                    label: track.label.split(' ')[0],
                    kind: track.kind,
                    default: track.default || false
                }
            ))
            : []
    };

    return (
        <div className="video-section">
            <div className="video-player">
                {episodeLoading !== 2 &&
                    <img className="video-player-poster" src={poster} alt='Anime Poster'/>
                }

                {episodeLoading === 10 &&
                    <div className="episode-error">
                        Failed to fetch Episode Sources (Try Another Server)
                    </div>
                }

                {episodeLoading === 0 && 
                    <div className="episode-loader">
                        <div className="episode-loader-container">
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                        </div>
                    </div>
                }
                {episodeLoading === 2 && 
                    <VideoJS options={videoJsOptions} />
                }
            </div>

            <div className="servers">
                <span> Change Server: </span>

                {serversListLoading === 10 && 
                    <div className="servers-list-error">
                        Failed to fetch Servers List (Click Again)
                    </div>
                }

                {serversListLoading === 0 &&
                    <div className="server-loader">
                        <div className="server-loader-container">
                            <div className="dot" />
                        </div>
                    </div>
                }

                {serversListLoading === 2 && serversList.map((server) => (
                    <button
                        key={server.serverId}
                        className={`server-button ${currentServer === server.serverName ? 'active' : ''}`}
                        onClick={() => handleServerClick(server.srcId, server.serverName)}
                    // disabled={!servers.vidstream}
                    >
                        {server.serverName}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Watch;