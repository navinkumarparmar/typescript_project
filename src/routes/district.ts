import { Router } from 'express';

import { validationMiddleware } from '../middleware/validationMiddleware';


import verifytokenmiddlewere from '../middleware/verifytoken'
import DistrictController from '../controllers/district/district'
import { District } from '../models/district/districtinterface';

const router = Router();

router.post('/create', validationMiddleware(District), verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),DistrictController.createDistrict);

router.delete('/delete/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),DistrictController.deleteDistrict);
router.get('/list', verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin', 'editor']), DistrictController.list);
router.get('/list/:id',verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin', 'editor','viewer']),DistrictController.listbyid);
router.put('/update/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),DistrictController.updateDistrict);
export default router;