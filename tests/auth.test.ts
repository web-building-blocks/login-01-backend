import request from 'supertest';
import express from 'express';
import authRouter from '../src/routes/auth';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
    it('should return error on login with invalid user', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'nonexistent@example.com',
            password: 'wrongpassword'
        });
        expect(res.statusCode).toBe(400);
    });

    it('should reject user data fetch without token', async () => {
        const res = await request(app).get('/auth/user');
        expect(res.statusCode).toBe(401);
    });
});
