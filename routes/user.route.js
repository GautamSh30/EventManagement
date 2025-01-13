import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import { authUser, ensureSameUser, allowSelfOrAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Email must be a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('username').notEmpty().withMessage('Username is required'),
    ],
    userController.createUserController
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email must be a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    userController.loginController
);

router.get('/logout', authUser, userController.logoutController);

router.get('/:userId', authUser, allowSelfOrAdmin, userController.getUserByIdController);

router.put(
    '/:userId',
    authUser,
    ensureSameUser,
    [
        body('email').optional().isEmail().withMessage('Must be a valid email address'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    userController.updateUserController
);

export default router;
