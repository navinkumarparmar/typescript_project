import { Router } from 'express';

import { validationMiddleware } from '../middleware/validationMiddleware';


import verifytokenmiddlewere from '../middleware/verifytoken'
import StateController from '../controllers/state/state'
import { State } from '../models/state/state.interface';

const router = Router();

router.post('/create', validationMiddleware(State), StateController.createState);

router.delete('/delete/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),StateController.deleteState);
router.get('/list', verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin', 'editor']), StateController.list);
router.get('/list/:id',verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin', 'editor','viewer']),StateController.listbyid);
router.put('/update/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),StateController.updateState);
export default router;
 