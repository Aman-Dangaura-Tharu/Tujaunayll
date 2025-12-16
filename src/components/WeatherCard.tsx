// src/components/WeatherCard.tsx
import type { WeatherData } from '../types/weather';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const weatherIcon = data.weather[0].icon;

  // Get the appropriate weather icon based on the weather condition
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '/weather.png',   // clear sky (day) - using weather.png for consistency
      '01n': '/weather.png',   // clear sky (night) - using weather.png for consistency
      '02d': '/weather.png',   // few clouds (day)
      '02n': '/weather.png',   // few clouds (night)
      '03d': '/weather.png',   // scattered clouds - using weather.png for consistency
      '03n': '/weather.png',   // scattered clouds - using weather.png for consistency
      '04d': '/weather.png',   // broken clouds - using weather.png for consistency
      '04n': '/weather.png',   // broken clouds - using weather.png for consistency
      '09d': '/weather.png',   // shower rain - using weather.png for consistency
      '09n': '/weather.png',   // shower rain - using weather.png for consistency
      '10d': '/weather.png',   // rain (day) - using weather.png for consistency
      '10n': '/weather.png',   // rain (night) - using weather.png for consistency
      '11d': '/storm.png',     // thunderstorm
      '11n': '/storm.png',     // thunderstorm
      '13d': '/snow.png',      // snow
      '13n': '/snow.png',      // snow
      '50d': '/fog.png',       // mist/fog
      '50n': '/fog.png'        // mist/fog
    };
    return iconMap[iconCode] || '/hot.png';
  };

  return (
    <div className="weather-card bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-24 h-24 flex items-center justify-center">
          <img
            src={getWeatherIcon(weatherIcon)}
            alt={data.weather[0].description}
            className="w-20 h-20 object-contain"
          />
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