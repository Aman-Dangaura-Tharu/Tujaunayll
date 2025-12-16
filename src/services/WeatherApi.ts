// src/services/WeatherApi.ts
import type { WeatherData } from '../types/weather';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// Log environment variables for debugging (remove in production)
console.log('Environment Variables:', {
  VITE_WEATHER_API_KEY: API_KEY ? '***' + API_KEY.slice(-4) : 'Not set',
  NODE_ENV: import.meta.env.MODE,
});

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  if (!city.trim()) {
    throw new Error('Please enter a city name');
  }

  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured. Please check your .env file.');
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    console.log('Fetching weather from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch weather: ${response.status} ${response.statusText}`
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to fetch weather data. Please try again later.');
  }
};