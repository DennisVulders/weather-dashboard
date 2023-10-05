import React, { useState, useEffect } from 'react';
import { WiStrongWind, WiHumidity, WiDaySunny, WiCloud, WiRain, WiThunderstorm, WiSnow } from 'react-icons/wi';
import '../assets/main.css';
import ForecastItem from './ForecastItem';

function WeatherDashboard() {
  const [forecastData, setForecastData] = useState(null);
  const apiKey = 'f184d76cabe4f11d11705e3c68a8d35f'; // Your API key
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedItemIndex, setExpandedItemIndex] = useState(null); // Add state to track expanded item

  useEffect(() => {
    // Fetch weather data for Helmond, Netherlands
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Helmond,nl&appid=${apiKey}&units=metric`;

    fetchWeatherData(apiUrl);

    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, [apiKey]);

  const fetchWeatherData = (apiUrl) => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setForecastData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleToggleItem = (index) => {
    // Toggle the expanded item index
    if (expandedItemIndex === index) {
      setExpandedItemIndex(null); // Collapse if clicked again
    } else {
      setExpandedItemIndex(index);
    }
  };

  const getWeatherIcon = (description) => {
    switch (description.toLowerCase()) {
      case 'clear sky':
        return <WiDaySunny />;
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return <WiCloud />;
      case 'shower rain':
      case 'rain':
        return <WiRain />;
      case 'thunderstorm':
        return <WiThunderstorm />;
      case 'snow':
        return <WiSnow />;
      default:
        return <WiCloud />; // Default icon
    }
  };

  const calculateAverageTemp = (forecasts) => {
    const sum = forecasts.reduce((total, forecast) => total + forecast.main.temp, 0);
    const averageTemp = sum / forecasts.length;
    return parseInt(averageTemp); // Convert the average temperature to an integer
  };

  const calculateAverageHumidity = (forecasts) => {
    const sum = forecasts.reduce((total, forecast) => total + forecast.main.humidity, 0);
    return Math.round(sum / forecasts.length); // Calculate the average and round it to the nearest whole number
  };

  const calculateAverageWindSpeed = (forecasts) => {
    const sum = forecasts.reduce((total, forecast) => total + forecast.wind.speed, 0);
    return (sum / forecasts.length).toFixed(2); // Calculate the average and round it to two decimal places
  };

  const groupForecastByDay = (forecastData) => {
    const groupedForecast = {};

    if (!forecastData || !forecastData.list) {
      return groupedForecast; // Return an empty object if forecastData is null or does not have a list property
    }

    forecastData.list.forEach((forecast) => {
      const date = forecast.dt_txt.split(' ')[0];
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }); // Convert date to day name

      if (!groupedForecast[dayName]) {
        groupedForecast[dayName] = [];
      }

      groupedForecast[dayName].push(forecast);
    });

    return groupedForecast;
  };

  const groupedForecast = groupForecastByDay(forecastData || {});

  // Format the current time as "HH:mm"
  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className='weather-dashboard'>
      <div className="current-weather">
        <span className='current-weather-city'>The current weather in Helmond</span>
        <div className='current-weather-header'>
          <span className='time'>{formatTime(currentTime)}</span>
          {forecastData && (
          <div className='weather'>
            <span className='weather-icon'>{getWeatherIcon(forecastData.list[0].weather[0].description)}</span>
            <span className='weather-temperature-value'>{parseInt(forecastData.list[0].main.temp)}
              <span className='weather-temperature-unit'>°C</span>
            </span>
          </div>
          )}
        </div>
        {forecastData && (
          <div className="current-weather-info">
            <div className='current-humidity'>
              <WiHumidity className="weather-info-icon" />
              <span className='weather-icon-text'>{forecastData.list[0].main.humidity}%</span>
            </div>
            <div className='current-speed'>
              <WiStrongWind className="weather-info-icon" />
              <span className='weather-icon-text'>{forecastData.list[0].wind.speed} m/s</span>
            </div>
          </div>
        )}
      </div>
      {/* Calculate and display daily averages */}
      <div className="daily-forecast">
        {Object.keys(groupedForecast).map((dayName, index) => (
          <ForecastItem
            key={dayName}
            dayName={dayName}
            temperature={calculateAverageTemp(groupedForecast[dayName])}
            description={groupedForecast[dayName][0].weather[0].description}
            humidity={calculateAverageHumidity(groupedForecast[dayName])}
            windSpeed={calculateAverageWindSpeed(groupedForecast[dayName])}
            isExpanded={index === expandedItemIndex} // Pass isExpanded prop based on index
            onToggle={() => handleToggleItem(index)} // Pass onToggle function
          />
        ))}
      </div>
    </div>
  );
}

export default WeatherDashboard;