import dotenv from 'dotenv';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
dotenv.config();

// TODO: Define an interface for the Coordinates object (if you use the GEO API you are not required to)

interface IWeather {
  city: string;
  date: Dayjs | string; // you can use dayjs or just a string delete it if you do not
  tempF: number;
  windSpeed: number; //response.wind.speed,
  humidity: number;
  icon: string;
  iconDescription: string;
  }
// TODO: Define a class for the Weather object
class Weather implements IWeather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;

  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

interface IWeatherService {
  getWeatherForCity(city: string): Promise<Weather[]>; //this is an async function
}
// TODO: Complete the WeatherService class
class WeatherService implements IWeatherService {

  async getWeatherForCity(city: string): Promise<Weather[]> {
    // get the weather from the API
    const baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error ('No API key found.');
    }

    try {
      const response = await axios.get(`${baseURL}/data/2.5/forecast`, {
        params: {
          q: city,
          appid: apiKey,
          units: 'imperial'
        },
      });
      // filter to the days you want (current + 5)
      const {list, city: cityData} = response.data;
      const forecastData = list.filter((day: any) =>
        day.dt_txt.includes('12:00:00')
      );
      // map the API data to your weather class
      const forecastArray = forecastData.map((day: any) => {
        const {main, wind, weather} = day;
        const {temp, humidity} = main;
        const {speed} = wind;
        const {icon, description} = weather[0];

        return new Weather(
          cityData.name,
          dayjs(day.dt_txt).format('YYYY-MM-DD'),
          temp,
          speed,
          humidity,
          icon,
          description
        );
      });

      return forecastArray;

    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.error(`City ${city} not found.`);
        throw new Error(`City ${city} not found.`);
      }
      throw new Error(`Failed to retrieve weather data: ${error}`)
    }
    
  }
}

export default new WeatherService();
