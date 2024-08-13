import { Router } from 'express';

import UserLevelController from '../controllers/userlevel'
import { validationMiddleware } from '../middleware/validationMiddleware';
import { UserLevel } from '../models/userlevelinterface';
import verifytokenmiddlewere from '../middleware/verifytoken'

const router = Router();

router.post('/create',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin']),validationMiddleware(UserLevel),UserLevelController.CreateUserLevel)
router.get('/list',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin']),UserLevelController.list);
router.delete('/delete/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin']),UserLevelController.deleteUser);
router.put('/update/:id',UserLevelController.UpdateUserLevel);
export default router;
 