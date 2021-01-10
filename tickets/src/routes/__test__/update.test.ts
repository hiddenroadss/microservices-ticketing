import request from 'supertest';
import mongoose from 'mongoose';

import {app} from '../../app';
import {Ticket} from '../../models/ticket';


it('returns a 404 if provided ID does not exist', async() => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'blabla',
            price: 20
        })
        .expect(404);
});

it('returns a 401 if a user is not authenticated', async() => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Onedsd',
            price: 22
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async() => {
    const title = 'Wow cool!';
    const price = 200;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title,
            price
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'New Title',
            price: 12
        })
        .expect(401);
    const ticket = await Ticket.findById(response.body.id);
    expect(ticket.title).toEqual(title);
    expect(ticket.price).toEqual(price);
});

it('returns a 400 if a user provides invalid title or price', async() => {
    const title = 'Wow cool!';
    const price = 200;
    const cookie = global.signup();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title,
            price
        });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 22
        })
        .expect(400);
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Something',
            price: -15
        })
        .expect(400);
});

it('updates a ticket if provided valid data', async() => {
    const newTitle = 'Wow cool!';
    const newPrice = 200;
    const cookie = global.signup();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Hey hi',
            price: 99
        });
    const responseUpdated = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice
        })
        .expect(200);
    expect(responseUpdated.body.title).toEqual(newTitle);
    expect(responseUpdated.body.price).toEqual(newPrice);
});
