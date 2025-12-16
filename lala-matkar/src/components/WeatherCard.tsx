// src/components/WeatherCard.tsx
import { useEffect, useState } from 'react';
import type { WeatherData } from '../types/weather';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const [seasonalImage, setSeasonalImage] = useState<string>('');
  const weatherIcon = data.weather[0].icon;

  // Determine the current season based on the current date
  const getSeason = (): string => {
    const date = new Date();
    const month = date.getMonth() + 1; // getMonth() is 0-indexed
    
    // Northern Hemisphere seasons
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter'; // December to February
  };

  // Set seasonal image based on the current season and weather condition
  useEffect(() => {
    const season = getSeason();
    const isDay = weatherIcon.endsWith('d');
    
    // Base URL for weather images (using OpenWeatherMap's weather condition codes)
    const baseUrl = 'https://openweathermap.org/img/wn/';
    
    // Map weather conditions to appropriate seasonal images
    const weatherCode = weatherIcon.replace(/[dn]$/, ''); // Remove day/night indicator
    
    // Default to weather code based image
    let imageUrl = `${baseUrl}${weatherCode}@2x.png`;
    
    // Override with seasonal images for certain conditions
    if (['01', '02'].includes(weatherCode)) { // Clear or few clouds
      imageUrl = `https://source.unsplash.com/300x200/?${season}-landscape`;
    } else if (['09', '10', '11'].includes(weatherCode)) { // Rain/Thunderstorm
      imageUrl = `https://source.unsplash.com/300x200/?${season}-rain`;
    } else if (weatherCode === '13') { // Snow
      imageUrl = 'https://source.unsplash.com/300x200/?winter-snow';
    } else if (weatherCode === '50') { // Mist/Fog
      imageUrl = 'https://source.unsplash.com/300x200/?fog';
    }
    
    setSeasonalImage(imageUrl);
  }, [weatherIcon]);

  // Get the appropriate weather icon based on the weather condition
  const getWeatherIcon = (iconCode: string) => {
    // If we have a seasonal image, use it
    if (seasonalImage) return seasonalImage;
    
    // Fallback to default icons
    const iconMap: { [key: string]: string } = {
      '01d': 'https://openweathermap.org/img/wn/01d@2x.png',   // clear sky (day)
      '01n': 'https://openweathermap.org/img/wn/01n@2x.png',   // clear sky (night)
      '02d': 'https://openweathermap.org/img/wn/02d@2x.png',   // few clouds (day)
      '02n': 'https://openweathermap.org/img/wn/02n@2x.png',   // few clouds (night)
      '03d': 'https://openweathermap.org/img/wn/03d@2x.png',   // scattered clouds
      '03n': 'https://openweathermap.org/img/wn/03n@2x.png',   // scattered clouds
      '04d': 'https://openweathermap.org/img/wn/04d@2x.png',   // broken clouds
      '04n': 'https://openweathermap.org/img/wn/04n@2x.png',   // broken clouds
      '09d': 'https://openweathermap.org/img/wn/09d@2x.png',   // shower rain
      '09n': 'https://openweathermap.org/img/wn/09n@2x.png',   // shower rain
      '10d': 'https://openweathermap.org/img/wn/10d@2x.png',   // rain (day)
      '10n': 'https://openweathermap.org/img/wn/10n@2x.png',   // rain (night)
      '11d': 'https://openweathermap.org/img/wn/11d@2x.png',   // thunderstorm
      '11n': 'https://openweathermap.org/img/wn/11n@2x.png',   // thunderstorm
      '13d': 'https://openweathermap.org/img/wn/13d@2x.png',   // snow
      '13n': 'https://openweathermap.org/img/wn/13n@2x.png',   // snow
      '50d': 'https://openweathermap.org/img/wn/50d@2x.png',   // mist/fog
      '50n': 'https://openweathermap.org/img/wn/50n@2x.png'    // mist/fog
    };
    return iconMap[iconCode] || 'https://openweathermap.org/img/wn/01d@2x.png';
  };

  return (
    <div className="weather-card bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
          <div className="relative w-40 h-40 rounded-lg overflow-hidden shadow-md">
            <img
              src={getWeatherIcon(weatherIcon)}
              alt={`${data.weather[0].description} in ${getSeason()}`}
              className="w-full h-full object-cover transition-opacity duration-500"
              onError={(e) => {
                // Fallback to default weather icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1 text-sm">
              {getSeason().charAt(0).toUpperCase() + getSeason().slice(1)}
            </div>
          </div>
        </div>
        <div className="md:ml-6 mt-4 md:mt-0 w-full">
          <h3 className="text-xl font-bold text-gray-800 text-center md:text-left">
            Current Weather in {data.name}
          </h3>
          <p className="text-gray-600 text-center md:text-left">
            <span className="text-3xl font-bold text-gray-800">{Math.round(data.main.temp)}°C</span>
            <span className="ml-2 text-gray-500 capitalize">{data.weather[0].description}</span>
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center text-gray-700">
              <div className="w-8 h-8 mr-2 flex items-center">
                <img src="/humidity.png" alt="Humidity" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Humidity</div>
                <div className="font-semibold">{data.main.humidity}%</div>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700">
              <div className="w-8 h-8 mr-2 flex items-center">
                <img src="/wind.png" alt="Wind" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Wind</div>
                <div className="font-semibold">{data.wind.speed} m/s</div>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700">
              <div className="w-8 h-8 mr-2 flex items-center">
                <img src="/pressure-gauge.png" alt="Pressure" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Pressure</div>
                <div className="font-semibold">{data.main.pressure} hPa</div>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700">
              <div className="w-8 h-8 mr-2 flex items-center">
                <img src="/hot.png" alt="Feels like" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Feels like</div>
                <div className="font-semibold">{Math.round(data.main.feels_like)}°C</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;