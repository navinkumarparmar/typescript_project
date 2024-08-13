import { Router } from 'express';

// import { validationMiddleware } from '../middleware/validationMiddleware';


import verifytokenmiddlewere from '../middleware/verifytoken'
import ProductController from '../controllers/product/product'
// import {ROLE} from  '../configrole/configrole'


// import { Product } from '../models/product/product.interface';
const router = Router();

router.post('/create',  verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin',]),ProductController.createProduct);

router.put('/deleteitem/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),ProductController.deleteProductOne);

router.delete('/delete/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),ProductController.deleteProduct);

router.get('/list', verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin', 'editor',]), ProductController.list);
router.get('/listbyid/:id',ProductController.listbyid);
router.put('/update/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),ProductController.updateProduct);
router.get('/Searchquery',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor','viewer']),ProductController.searchAndFilter)
// router.get('/Searchquery',ProductController.searchAndFilter)

export default router;
 
