import { useLocation } from 'react-router-dom';
import { fetchSearchAnime } from '../services/fetchSearchAnime';
import { useEffect, useState } from 'react';
import BigCard from '../components/BigCard';

const Search = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const title = params.get('title');

    const [pageLoading, setPageLoading] = useState(0);
    const [searchAnime, setSearchAnime] = useState();

    
    useEffect(()=>{
        setPageLoading(0);
        const fetchSearchPage = async () =>{
            let data;
            let err = false;
            const cache = sessionStorage.getItem(`${title}-titleSearched`)
            if(cache){
                console.log(`searchAnime found for: ${title}-titleSearched`);
                console.log(cache);
                data = JSON.parse(cache);
            }
            else{
                try{
                    data = await fetchSearchAnime(title);
                    console.log(data);
                    sessionStorage.setItem(`${title}-titleSearched`, JSON.stringify(data));
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
                setSearchAnime(data);
                setPageLoading(1);
            }
        }
        fetchSearchPage();
    }, [title]);

    if (pageLoading===10) return <h2 style={{ marginLeft: '30px', color: 'white' }}>Failed to load data</h2>;
    if (pageLoading===0) return <h2 style={{ marginLeft: '30px', color: 'white' }}>Loading results for "{title}"...</h2>;

    return (
        <div>
            {searchAnime.length === 0 ? (
                <h2 style={{ marginLeft: '30px', color: 'white' }}>
                    No results found for "{title}"
                </h2>
            ) : (
                <div className="results"
                    style={{
                        'padding': '30px',
                        'paddingTop': '10px',
                        'display': 'grid',
                        'gridTemplateRows': 'auto',
                        'gridTemplateColumns': 'repeat(auto-fill, minmax(350px, 1fr))',
                        'gap': '25px 20px',
                        'overflow': 'hidden'
                    }}>
                    {searchAnime.map((anime, index) => (
                        <BigCard key={index} anime={anime} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
