import logo from '../assets/LogoIcon.png';
import searchIcon from '../assets/search.png';
import locationIcon from '../assets/currentlocation.png';
import { useState } from 'react';
import { toast } from 'react-toastify';

const NavBar = ({ onCitySearch, onLocationFetch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQuery = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onCitySearch(searchQuery.trim());
      setSearchQuery('');
    } else {
      toast.warn('Please enter a city name');
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        onLocationFetch(latitude, longitude);
        setSearchQuery('');
      });
    } else {
      toast.error('Geolocation not supported');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-4">
      <img src={logo} alt="Logo" className="w-44 select-none" />
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-md bg-white rounded-lg shadow-md">
        <img src={searchIcon} alt="Search Icon" className="absolute left-3 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchQuery}
          placeholder="Search for your preferred city..."
          className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 rounded-lg outline-none"
        />
        <button type="submit" className="bg-[#050e1f] text-white px-5 py-2 rounded-r-lg hover:bg-[#1b243a]">Search</button>
      </form>
      <div
        onClick={handleLocationClick}
        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded cursor-pointer hover:bg-green-600"
      >
        <img src={locationIcon} alt="Location Icon" className="w-5 h-5" />
        <p>Current Location</p>
      </div>
    </div>
  );
};

export default NavBar;
