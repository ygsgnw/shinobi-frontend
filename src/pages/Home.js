import TrendingCarousel from '../components/TrendingCarousel';
import HorizontalCarousel from '../components/HorizontalCarousel';
import VerticalCarousel from '../components/VerticalCarousel';
import { useEffect, useState } from 'react';
import { fetchHomeAnime } from '../services/fetchHomeAnime';

function Home() {
    const [pageLoading, setPageLoading] = useState(0);
    const [homeAnime, setHomeAnime] = useState();

    
    useEffect(()=>{
        const fetchHomePage = async () =>{
            let data;
            let err = false;
            const cache = sessionStorage.getItem('shinobiHomePage')
            if(cache){
                console.log("homeAnime found");
                console.log(cache);
                data = JSON.parse(cache);
            }
            else{
                try{
                    data = await fetchHomeAnime();
                    console.log(data);
                    sessionStorage.setItem('shinobiHomePage', JSON.stringify(data));
                }
                catch(error){
                    // console.log('error');
                    err = true;
                }
            }
            
            if(err){
                setPageLoading(10);
            }
            else{
                setHomeAnime(data);
                setPageLoading(1);
            }
        }
        fetchHomePage();
    }, []);

    if (pageLoading===10) return <h2 style={{ marginLeft: '30px', color: 'white' }}>Failed to load Home Page</h2>;
    if (pageLoading===0) return <h2 style={{ marginLeft: '30px', color: 'white' }}>Loading Home Page ...</h2>;

    return (
        <>
            <TrendingCarousel animeList={homeAnime.trending.media} />
            <HorizontalCarousel animeList={homeAnime.topAiring.media} heading='TOP AIRING' carouselId='anime' />
            <HorizontalCarousel animeList={homeAnime.seasonalPopular.media} heading='SEASONAL POPULAR' carouselId='anime' />
            <div className="four" style={{ 'display': 'flex', 'justifyContent': 'space-between', 'margin': '10px' }}>
                <VerticalCarousel animeList={homeAnime.topRated.media} heading='TOP RATED' />
                <VerticalCarousel animeList={homeAnime.mostPopular.media} heading='MOST POPULAR' />
                <VerticalCarousel animeList={homeAnime.mostFavorite.media} heading='MOST FAVORITE' />
                <VerticalCarousel animeList={homeAnime.upcomingPopular.media} heading='UPCOMING POPULAR' />
            </div>
        </>
    );
}

export default Home;