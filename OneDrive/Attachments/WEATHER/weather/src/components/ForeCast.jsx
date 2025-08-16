import React from 'react';

const ForeCast = ({ forecast }) => {
  if (!forecast || !forecast.list) return null;

  const dailyForecasts = [];
  const seenDays = new Set();

  for (let item of forecast.list) {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = date.toLocaleDateString();

    if (!seenDays.has(day)) {
      seenDays.add(day);
      dailyForecasts.push({
        date: fullDate,
        day,
        temperature: `${Math.round(item.main.temp)}°C`,
        icon: item.weather[0].icon
      });
    }

    if (dailyForecasts.length === 5) break;
  }

  return (
    <div className="bg-[#0e1a34] p-4 rounded-xl shadow-md h-full">
      <h2 className="text-white text-md font-semibold mb-4">5-Day Forecast</h2>
      <div className="flex flex-col space-y-4">
        {dailyForecasts.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-[#17253e] p-3 rounded-xl">
            <div className="text-white text-sm w-1/2">
              <p>{item.day}</p>
              <p className="text-xs">{item.date}</p>
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
              alt="weather icon"
              className="w-12 h-12"
            />
            <p className="text-white text-md font-bold">{item.temperature}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForeCast;
