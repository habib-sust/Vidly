const request = require('supertest');
const {User} = require('../../models/user');

describe('/api/users', () => {
    let server;
    let user;
    let name;
    let email;
    let password;

    beforeEach( async () => {
        server = require('../../index');
        name = '123';
        email = '123@gmail.com';
        password = '12345678';

    });
    afterEach(async () => {
        await server.close();
        await User.remove({});
    });

    describe('GET /me', () => {
        let token;

        const exec = () => {
            return request(server)
                .get('/api/users/me')
                .set('x-auth-token', token);
        };

        beforeEach(async () => {
            user = new User({name, email, password});
            await user.save();

            token = user.generateAuthToken();
        });

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return the user if logged in', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['name', 'email']));
        });
    });

    describe('POST /', () => {

        const exec = () => {
            return request(server)
                .post('/api/users')
                .send({name, email, password});
        }

        it('should return 400 if name is less then 3 characters', async () => {
            name = '12';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is more  then 255 characters', async () => {
            name = new Array(257).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is less then 5 characters', async () => {
            email = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is invalid', async () => {
            email = '123456';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is less then 8 characters', async () => {
            password = '1234567';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if user already registered', async () => {
            user = new User({name, email, password});
            await user.save();

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the user if input is valid', async () => {
            await exec();

            const userInDb = await User.find({email: email});
            expect(userInDb).not.toBeNull(  );
        });

        it('should return the user if input is valid', async () => {
            const res = await exec();

            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['name', 'email']));
        });

        it('should return the auth-token in header if input is valid', async () => {
            const res = await exec();

            expect(res.header).toHaveProperty('x-auth-token');
        });


    });
});
