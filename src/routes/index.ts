import { Router } from 'express';
import user from './user';
import userlevel  from './userlevel';
import auth from './auth';
import state from './state'
import district from './district';
import city from './city';
import shop from './shop';
import product from './product';
import coustomer from './coustomer';
// import authgoogle from './googleauth'
const router = Router();
 
router.use('/user',user);
router.use('/userlevel',userlevel)
router.use('/state',state)
router.use('/district',district)
router.use('/city',city)
router.use('/auth',auth);
router.use('/shop',shop);
router.use('/product',product);
router.use('/coustomer',coustomer);
// router.use('/authgoogle',authgoogle);

export default router;
