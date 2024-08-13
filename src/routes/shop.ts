import { Router } from 'express';

import { validationMiddleware } from '../middleware/validationMiddleware';


import verifytokenmiddlewere from '../middleware/verifytoken'
import ShopController from '../controllers/shop/shop'


import { Shop } from '../models/shop/shop.interface';
const router = Router();

router.post('/create', validationMiddleware(Shop),verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin']),ShopController.createShop);

router.delete('/delete/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),ShopController.deleteShop);
router.get('/list', verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin']), ShopController.list);
router.get('/list/:id',verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin']),ShopController.listbyid);
router.put('/update/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),ShopController.updateShop);
export default router;
 