import React from 'react';
import { WiStrongWind, WiHumidity, WiDaySunny, WiCloud, WiRain, WiThunderstorm, WiSnow } from 'react-icons/wi';
import '../assets/main.css';

function ForecastItem({ dayName, temperature, description, humidity, windSpeed, isExpanded, onToggle }) {
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

  return (
    <div className={`forecast-item ${isExpanded ? 'expanded' : ''}`} onClick={onToggle}>
      <div>
        <span className='weather-icon-text'>{temperature}°C</span>
      </div>
      <div className='weather-icon'>{getWeatherIcon(description)}</div>
      <span className='weather-icon-text'>{dayName}</span>
      {isExpanded && (
        <div className='more-details'>
          <div>
            <WiHumidity className="weather-info-icon"/>
            <span className='weather-icon-text'>{humidity}%</span>
          </div>
          <div>
            <WiStrongWind className="weather-info-icon"/>
            <span className='weather-icon-text'>{windSpeed} m/s</span> 
          </div>
        </div>
      )}
    </div>
  );
}

export default ForecastItem;