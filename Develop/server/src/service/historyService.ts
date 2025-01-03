import fs from 'node:fs/promises';
import { v4 as uuidv4} from 'uuid';

// TODO: Define a City class with name and id properties



// answer
class City{
name: string;
id: string;
constructor(id:string, name: string){
  this.name =name;
  this.id =id;
}
}
// TODO: Complete the HistoryService class
class HistoryService {
  //  i add the following
  private filePath:string = "db/searchHistory.json";
  
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read() {
    return await fs.readFile(this.filePath,{
      flag: "a+",
     encoding : "utf8",
    });
  }

 
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]) {
    return await fs.writeFile(
this.filePath,
JSON.stringify(cities, null, "\t")
  ); 
  }
  
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities() {
    return await this.read().then((cities)=>{
      let parsedCities: City[];
      try{
        parsedCities = [].concat(JSON.parse(cities));
      }catch(err){
        parsedCities = [];
      }
      return parsedCities;
    });
  }
 
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(city: string) {
    if(!city){
      throw new Error("City cannot be blank");
    }
    const newCity: City={
      name:city,
      id: uuidv4(),
    };
    return await this.getCities()
    .then((cities)=>{
      return[...cities, newCity];
    })
    .then((updatedCities)=>{
      this.write(updatedCities)
      .then(()=>newCity);
    })
  }
  
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  async removeCity(id: string) {
    return await this.getCities()
    .then((cities)=> cities.filter((city) => city.id !=id))
    .then((filteredCities) => this.write(filteredCities));
  }
  
  }

export default new HistoryService();
