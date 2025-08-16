import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Clock from './Clock';
import ForeCast from './ForeCast';
import HourlyForecast from './HourlyForecast';

import humidity from '../assets/humidity.png';
import pressure from '../assets/pressure.png';
import wind from '../assets/wind.png';
import uv from '../assets/uv-white.png';
import sunriseIcon from '../assets/sunrise-white.png';
import sunsetIcon from '../assets/sunset-white.png';

const CityAndTime = ({ cityName, lat, lon, setLat, setLon }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const appid = '87a1efde2e84a06b0989812ce0392e77';
      const units = 'metric';
      let weatherUrl;

      if (cityName) {
        const encodedCity = encodeURIComponent(cityName);
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=${units}&appid=${appid}`;
      } else if (lat && lon) {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${appid}`;
      } else {
        return;
      }

      const currentWeather = await axios.get(weatherUrl);
      setWeatherData(currentWeather.data);

      const { coord } = currentWeather.data;
      if (!lat || !lon || lat !== coord.lat || lon !== coord.lon) {
        setLat(coord.lat);
        setLon(coord.lon);
      }

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=${units}&appid=${appid}`;
      const forecast = await axios.get(forecastUrl);
      setForecastData(forecast.data);

      const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${appid}`;
      const uvResponse = await axios.get(uvUrl);
      setUvIndex(uvResponse.data.value);
    } catch (error) {
      toast.error("Failed to fetch weather data.");
      setWeatherData(null);
      setForecastData(null);
      setUvIndex(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cityName || (lat && lon)) {
      setLoading(true);
      fetchData();
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          setLat(latitude);
          setLon(longitude);
        });
      }
    }
  }, [cityName, lat, lon]);

  if (loading) {
    return <div className="text-white text-3xl text-center mt-20">Loading weather data...</div>;
  }

  if (!weatherData || !forecastData) {
    return <div className="text-white text-2xl text-center mt-20">No data available.</div>;
  }

  const { main, weather, sys, wind: windData } = weatherData;
  const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString();
  const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0e1a34] p-6 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold">{weatherData.name}</h1>
          <img
            src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
            alt="weather icon"
            className="w-24 mx-auto"
          />
          <Clock />
        </div>

        <div className="bg-[#0e1a34] p-6 rounded-xl shadow-md grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="text-center flex flex-col justify-center items-center">
            <h1 className="text-6xl font-bold">{Math.round(main.temp)}°C</h1>
            <p className="mt-1">
              Feels like: <span className="font-semibold">{Math.round(main.feels_like)}°C</span>
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 justify-center">
                <img src={sunriseIcon} alt="sunrise" className="w-5 h-5" />
                <span>{sunriseTime}</span>
                <span>Sunrise</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <img src={sunsetIcon} alt="sunset" className="w-5 h-5" />
                <span>{sunsetTime}</span>
                <span>Sunset</span>
              </div>
            </div>
          </div>

          <div className="text-center flex flex-col justify-center items-center">
            <img
              src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
              alt="icon"
              className="w-24"
            />
            <p className="text-xl font-semibold capitalize">{weather[0].description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center text-center">
            <div>
              <img src={humidity} alt="humidity" className="w-8 mx-auto" />
              <p>{main.humidity}%</p>
              <p className="text-xs">Humidity</p>
            </div>
            <div>
              <img src={wind} alt="wind" className="w-8 mx-auto" />
              <p>{windData.speed} km/h</p>
              <p className="text-xs">Wind Speed</p>
            </div>
            <div>
              <img src={pressure} alt="pressure" className="w-8 mx-auto" />
              <p>{main.pressure} hPa</p>
              <p className="text-xs">Pressure</p>
            </div>
            <div>
              <img src={uv} alt="uv" className="w-8 mx-auto" />
              <p>{uvIndex ?? 'N/A'}</p>
              <p className="text-xs">UV</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="w-full lg:w-1/2">
          <ForeCast forecast={forecastData} />
        </div>
        <div className="w-full lg:w-1/2">
          <HourlyForecast forecast={forecastData} />
        </div>
      </div>
    </div>
  );
};

export default CityAndTime;
