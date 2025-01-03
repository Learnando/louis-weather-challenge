import dotenv from "dotenv";
dotenv.config();

// TODO: Define an interface for the Coordinates object

interface Coordinates {
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city:string;
  date:string;
  icon:string;
  iconDescription:string; 
  tempF:string; 
  windSpeed:string; 
  humidity:string;

  constructor(
    city:string, 
    date:string,
     icon:string, 
     iconDescription:string,
      tempF:string,
       windSpeed:string, 
       humidity:string
      ){
    this.city = city;
    this.date = date;
    this.icon =icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity =humidity;

  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties

  /*
private baseUrl:string =process.env.API_BASE_URL || "https://api.openweathermap.org/data/2.5/forecast";
private apiKey: string= process.env.API_KEY || "";
private cityName:string= "";
*/

  private baseURL: string = "https://api.openweathermap.org";
  private apiKey: string = "cca0e752c7ffb89f86cb631b38627ed5";
  private cityName: string = "";

  // TODO: Create fetchLocationData method
    private async fetchLocationData(query: string) {

    const response = await fetch(
      `${this.baseURL}/geo/1.0/direct?${query}&appid=${this.apiKey}`
    );
    if(!response.ok) {
      console.log(`Error at fetchLocationData ${response.statusText}`);
      throw new  Error("Failed to fetch location data");
    }
    return response.json();
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = `lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
    const response = await fetch(
      `${this.baseURL}/data/2.5/forecast?${weatherQuery}&appid=${this.apiKey}&units=imperial`
    );
    if (!response.ok) {
      console.log(`Error at fetchWeatherData ${response.statusText}`);
      throw new Error("failed to retrieve weather data");
    }
    return response.json();
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any) {
    if(!response || !response.list || response.list.length ==0)
      throw new Error("Unable to parse current weather");

    const firstWeather = response.list[0];
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US");
    
    const currentWeatherData : Weather ={
      city: this.cityName,
      date: formattedDate,
      icon: firstWeather.weather[0]?.icon || "",
      iconDescription: firstWeather.weather[0]?.description || "",
      tempF: firstWeather.main.temp,
      windSpeed: firstWeather.wind.speed,
      humidity: firstWeather.main.humidity,
    }
    return currentWeatherData;
  }
 

  // TODO: Complete buildForecastArray method

  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    
    let forecastarray: Weather[] = [];

    forecastarray.push(currentWeather);

    for (let k=1; k<weatherData.length; k=k+8) {
      let forecastWeather = weatherData[k];

      let forcastWeatherDate = new Date(parseInt(forecastWeather.dt) * 1000);

      const month = String(forcastWeatherDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based 
      const day = String(forcastWeatherDate.getDate()).padStart(2, '0'); 
      const year = forcastWeatherDate.getFullYear(); // Format as "MM/DD/YYYY" 
      const formattedDate = `${month}/${day}/${year}`;

      const forecastWeatherData : Weather ={
        city: this.cityName,
        date: formattedDate,
        icon: forecastWeather.weather[0]?.icon || "",
        iconDescription: forecastWeather.weather[0]?.description || "",
        tempF: forecastWeather.main.temp,
        windSpeed: forecastWeather.wind.speed,
        humidity: forecastWeather.main.humidity,
      }

      forecastarray.push(forecastWeatherData);

    }

    return forecastarray;
  }


  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string) {
    this.cityName = city;
    console.log (`Getting weather for given city ${this.cityName}`);

    let geoquery = `q=${this.cityName}`;
    const geolocations = await this.fetchLocationData(geoquery);

    let coords : Coordinates = {
      latitude: geolocations[0].lat,
      longitude: geolocations[0].lon
    }

    console.log (JSON.stringify(coords));
    
    const weatherDataJson = await this.fetchWeatherData(coords);

    const currentWeather = this.parseCurrentWeather(weatherDataJson);
    console.log (JSON.stringify(currentWeather));

    const forecastWeather: any[] = this.buildForecastArray(currentWeather,weatherDataJson.list)

    return forecastWeather;
  }
}

export default new WeatherService();
