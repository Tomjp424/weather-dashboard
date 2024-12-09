import fs from 'fs/promises';

const searchHistory = './db/searchHistory.json'

// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = Date.now().toString();
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
   private async read(): Promise<City[]> {
    try {
      const searchData = await fs.readFile(searchHistory, 'utf-8');
      return JSON.parse(searchData);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
   }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
   private async write(cities: City[]): Promise<void> {
    await fs.writeFile(searchHistory, JSON.stringify(cities, null, 2));
   }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
   async getCities(): Promise<City[]> {
    return await this.read();
   }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
   async addCity(cityName: string): Promise<void> {
    const cityList = await this.read();

    const existingCity = cityList.some(
      (city) => city.name.toLowerCase() === cityName.toLowerCase() 
    );
    if (!existingCity) {
      cityList.push(new City(cityName));
      await this.write(cityList);
    }
   }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
   async removeCity(id: string): Promise<void> {
    const cityList = await this.read();
    const updatedCityList = cityList.filter((city) => city.id !== id);
    await this.write(updatedCityList);
   }
}

export default new HistoryService();
