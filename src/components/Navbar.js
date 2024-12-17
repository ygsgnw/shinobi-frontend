import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ('../styles/navbar.css');

function Navbar() {
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?title=${encodeURIComponent(searchText)}`);
        setSearchText('');
    };

    return (
        <div className="navbar">
            <Link to="/">
                SHINOBI
            </Link>
            <form className="search-section" onSubmit={handleSubmit} >
                <div className="search-bar">
                    <input onChange={handleInputChange} value={searchText} id="inputId" type="text" placeholder="Search Anime" className="search-field" name="title" required/>
                </div>
                <button className="search-button" type="submit">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path></svg>
                </button>
            </form>
        </div>
    );
}

export default Navbar;