import express,{Request, Response} from 'express';
import {body} from 'express-validator';
import {validateRequest, NotFoundError, NotAuthorizedError, requireAuth} from '@hirotickets/common';

import {Ticket} from '../models/ticket';


const router = express.Router();

router.put('/api/tickets/:id', 
    requireAuth, 
    [
        body('title')
            .notEmpty()
            .isString()
            .isLength({min: 3, max: 40})
            .withMessage('Title is invalid'),
        body('price')
            .notEmpty()
            .isFloat({gt: 0})
            .withMessage('Price is invalid')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            throw new NotFoundError();
        }
        if (req.currentUser!.id !== ticket.userId) {
            throw new NotAuthorizedError();
        }
        ticket.set({
            title: req.body.title,
            price: req.body.price
        });
        await ticket.save();
        res.send(ticket);
});


export {router as updateTicketRouter};