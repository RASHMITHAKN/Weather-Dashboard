import React from 'react';

const HourlyForecast = ({ forecast }) => {
  if (!forecast || !forecast.list) return null;

  const hourly = forecast.list.slice(0, 5);

  return (
    <div className="bg-[#0e1a34] p-6 rounded-xl shadow-md h-full">
      <h2 className="text-white text-xl font-semibold mb-4">Next Hours</h2>
      <div className="flex flex-col gap-4">
        {hourly.map((item, index) => {
          const time = new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          return (
            <div
              key={index}
              className="flex items-center justify-between bg-[#17253e] px-6 py-4 rounded-lg w-full"
              style={{ minHeight: '80px' }}
            >
              <div className="text-white">
                <p className="text-sm font-medium">{time}</p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="w-10 h-10"
              />
              <p className="text-white font-semibold text-lg">
                {Math.round(item.main.temp)}°C
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
