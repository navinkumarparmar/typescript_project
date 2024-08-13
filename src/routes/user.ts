import { Router } from 'express';
import UserController from '../controllers/userController';
import { validationMiddleware } from '../middleware/validationMiddleware';
import { User } from '../models/user.interface';

import verifytokenmiddlewere from '../middleware/verifytoken'


const router = Router();
/**
 * @swagger
 * /api/user/create:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *               gender:
 *                 type: string
 *                 example: male
 *               UserRole:
 *                 type: string
 *                 example: admin
 *               DistrictID:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: User successfully created, OTP sent to email for verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timeStamp:
 *                   type: number
 *                   example: 1625733211
 *                 message:
 *                   type: string
 *                   example: User successfully created, OTP sent to email for verification
 *       400:
 *         description: Invalid input or user with the same email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Duplicate email entry or invalid input
 */
router.post('/create',  UserController.createUserWithPhone);

/**
 * @swagger
 * /api/user/verifyEmail:
 *   post:
 *     summary: Verify user's email
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Email verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid email or verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or verification failed
 */
router.post('/verifyEmail', UserController.verifyEmail);

/**
 * @swagger
 * /api/user/list:
 *   get:
 *     summary: Get a list of users
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timeStamp:
 *                   type: integer
 *                   example: 1625529982
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved data
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: 'User'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get('/list', UserController.list);


router.delete('/delete/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),UserController.deleteUser);

router.get('/list/:id',verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin', 'editor','viewer']),UserController.listbyid);
router.put('/update/:id',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin', 'editor']),UserController.updateUser);

router.get('/listbydisid/:id', verifytokenmiddlewere.verifytoken, verifytokenmiddlewere.verifyrole(['admin']),UserController.listByStateId)
router.post('/forgetpassword',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin','viewer']),UserController.forgetPassword);
router.put('/resetpassword',verifytokenmiddlewere.verifytoken,verifytokenmiddlewere.verifyrole(['admin','viewer']),UserController.resetPassword);




export default router;
