import express, {Request, Response, NextFunction} from 'express';
import {body} from 'express-validator';
import jwt from 'jsonwebtoken';

import {validateRequest} from '../middlewares/validateRequest';
import {BadRequestError} from '../errors/badRequestError';
import {User} from '../models/user';
import {Password} from '../services/password';
 

const router = express.Router();

router.post('/api/users/signin', 
    [
        body('email')
        .isEmail()
        .withMessage('Email must be valid'),
        body('password')
        .trim()
        .notEmpty()
        .withMessage('You must apply a password')
    ],
    validateRequest,

    async (req: Request, res: Response, next: NextFunction) => {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }
        const passwordMatch = await Password.compare(existingUser.password, password);
        if (!passwordMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        //Generate JWT
        const userJWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!);

        //Store JWT on session object
        req.session = {
            jwt: userJWT
        };

        res.status(200).send(existingUser);
});

export {router as signInRouter};