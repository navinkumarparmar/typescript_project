import { Router } from 'express';

import { validationMiddleware } from '../middleware/validationMiddleware';


import verifytokenmiddlewere from '../middleware/verifytoken'
import CityController from '../controllers/city/city'
import { City } from '../models/city/cityinterface';

const router = Router();

router.post('/create', validationMiddleware(City), verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor','viewer']),CityController.createCity);

router.delete('/delete/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),CityController.deleteCity);
router.get('/list', verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin', 'editor']), CityController.list);
router.get('/list/:id',verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin', 'editor','viewer']),CityController.listbyid);
router.put('/update/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),CityController.updateCity);
export default router;