import { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import Clock from './components/Clock';
import { fetchWeather } from './services/WeatherApi';
import type { WeatherData } from './types/weather';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial weather fetch on component mount
  useEffect(() => {
    const loadInitialWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeather('Kathmandu');
        setWeatherData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load initial weather';
        setError(errorMessage);
        console.error('Error loading initial weather:', errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialWeather();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchCity = city.trim();
    
    if (!searchCity) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(searchCity);
      setWeatherData(data);
      setCity(''); // Clear the input after successful search
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Error fetching weather:', errorMessage);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Weather Forecast
        </h1>
        <p className="text-gray-600">
          
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Search Section */}
        <div className=" rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              
              
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow ">
              <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2 ">
                Search City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Eg: Kathmandu, London, Tokyo, Paris, New York"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={loading}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || !city.trim()}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : 'Get Weather'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-700">
                <span className="mr-2">⚠</span>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Weather Display */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-6"></div>
              <p className="text-gray-600 text-lg">Fetching weather data for "{city}"...</p>
            </div>
          </div>
        ) : weatherData ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Weather Header */}
            <div className="bg-gradient-to-r from-blue-400 to-green-400 text-white p-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                  <Clock timezone={weatherData.timezone} />
                </div>
                <div className="mt-4 md:mt-0 text-center">
                  <p className="text-6xl font-bold">
                    {Math.round(weatherData.main.temp)}°C
                  </p>
                  <p className="text-xl capitalize">
                    {weatherData.weather[0].description}
                  </p>
                  <p className="text-blue-100 text-sm mt-2">
                    Feels like {Math.round(weatherData.main.feels_like)}°C
                  </p>
                </div>
              </div>
            </div>

            {/* WeatherCard Component */}
            <div className="p-6 bg-blue-50">
              <WeatherCard data={weatherData} />
              
              {/* Weather Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="mr-2">🌧️</span>
                    <span className="font-medium">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{weatherData.main.humidity}%</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="mr-2">🌬️</span>
                    <span className="font-medium">Wind Speed</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {weatherData.wind.speed} m/s
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="mr-2">🌡️</span>
                    <span className="font-medium">Pressure</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {weatherData.main.pressure} hPa
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="mr-2">👁️</span>
                    <span className="font-medium">Visibility</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {weatherData.visibility ? `${(weatherData.visibility / 1000).toFixed(1)} km` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-7xl mb-6">🌍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Search for a city</h3>
            <p className="text-gray-600 mb-6">Enter a city name to see the weather forecast</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p className='text-bold text-lg text-gradient-700'>Accurate weather information provided by OpenWeatherMap</p>
          
        </footer>
      </main>
    </div>
  );
}

export default App;