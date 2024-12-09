import { Router } from 'express';
const router = Router();

 import HistoryService from '../../service/historyService.js';
 import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const {cityName} = req.body;
  if (!cityName) {
    return res.status(400).json({error: 'Please enter a city name.'});
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    res.json(weatherData);
    // TODO: save city to search history
    await HistoryService.addCity(cityName);
    return;
  } catch (error) {
    console.error('Error retrieving weather data:', error)
    res.status(500).json({error: 'Error retrieving weather data'});
    return;
  }

  
  
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const cityList = await HistoryService.getCities();
    res.json(cityList);
  } catch (error) {
    console.error('Error retrieving search history:', error)
    res.status(500).json({error: 'Error retrieving search history'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const {id} = req.params;

  try{
    await HistoryService.removeCity(id);
    res.json({message: 'City successfully deleted from history'});
  } catch (error) {
    console.error('Error deleting city from search history:', error)
    res.status(500).json({error: 'Error deleting city from search history'});
  }
});

export default router;
