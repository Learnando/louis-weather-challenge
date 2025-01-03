import { Router, type Request, type Response } from 'express';
const router = Router();

// i uncomment the 2 lines below
import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
//  i add  async before (req: Request, res: Response) and the code under the 2 comments
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
const {cityName} = req.body;

if (req.body){
  weatherService.getWeatherForCity(cityName)
  .then((weather)=>{
    res.json(weather);
  })
  .catch((error)=>{
    res.status(500)
    .json({error: `Failed to fetch weather data${error.data}`});
  })

  // TODO: save city to search history

}

historyService.addCity(cityName)

});



// TODO: GET search history

router.get('/history', async (_req: Request, res: Response) => {
//  i add the code under the router.get .......

try{
  const savedCity = await historyService.getCities();
   res.json({savedCity});
}catch(error){
  console.error('Error fetching history:', error);
 res.status(500).json({ error: 'Failed to fetch history' });
}

});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {

  //  i add the code below
try{
  if (!req.params.id){
    res.status(400).json({message: "City id required"});
  }
  await historyService.removeCity(req.params.id)
  res.json({success: "City was removed from the history succesfully"});
}catch(error){
  console.log(error);
  res.status(500).json(error);
}

});

export default router;
