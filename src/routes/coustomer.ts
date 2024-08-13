import { Router } from 'express';

import { validationMiddleware } from '../middleware/validationMiddleware';


import verifytokenmiddlewere from '../middleware/verifytoken'
import CoustomerController from '../controllers/coustomer/coustomer'


import { Coustomer } from '../models/coustomer/coustomer.interface';
const  router = Router();

//coustomer Routes 
//create, delete,get,update

router.post('/create', validationMiddleware(Coustomer),verifytokenmiddlewere.verifytoken,CoustomerController.createCoustomer);

router.delete('/delete/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),CoustomerController.deleteCoustomer);
router.get('/list',verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin', 'editor','viewer']),CoustomerController.list);
router.get('/list/:id',verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin', 'editor','viewer']),CoustomerController.listbyid);
router.put('/update/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),CoustomerController.updateCoustomer);
router.delete('/deleteitem',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin','viewer']),CoustomerController.deleteOrder);
router.post('/cancleorder/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin','viewer']),CoustomerController.cancelOrder);


  //review routes 
  //coustomer/this routes 

router.post('/reviewproduct',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin','viewer']),CoustomerController.ReviewProduct)
router.delete('/reviewdelete/:id', verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin','viewer']),CoustomerController.ReviewDelete)
router.get('/reviewlist',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin']),CoustomerController.ReviewList)
router.get('/reviewlistbyid/:id',CoustomerController.Reviwlistbyid);


export default router;
 