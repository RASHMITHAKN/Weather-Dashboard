import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import CityAndTime from './components/CityAndTime';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [cityName, setCityName] = useState(() => {
    return localStorage.getItem('savedCity') || '';
  });
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const handleCitySearch = (city) => {
    setCityName(city);
    setLat(null);
    setLon(null);
    localStorage.setItem('savedCity', city);
  };

  const handleLocationFetch = (latitude, longitude) => {
    setLat(latitude);
    setLon(longitude);
    setCityName('');
    localStorage.removeItem('savedCity');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#09162e]' : 'bg-gray-100'} font-sans px-4 py-6 text-white`}>
      <div className="flex justify-end mb-2">
        <button
          onClick={toggleTheme}
          className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
        >
          Toggle Theme
        </button>
      </div>

      <NavBar onCitySearch={handleCitySearch} onLocationFetch={handleLocationFetch} />
      <div className="max-w-screen-xl mx-auto mt-6">
        <CityAndTime
          cityName={cityName}
          lat={lat}
          lon={lon}
          setLat={setLat}
          setLon={setLon}
        />
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}

export default App;
