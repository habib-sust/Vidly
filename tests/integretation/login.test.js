const request = require('supertest');
const bcrypt = require('bcrypt');
const {User} = require('../../models/user');
let server;
describe('/api/auth', () => {
    let email;
    let password;
    let user;

    beforeEach(async () => {
        server = require('../../index');
        email = 'habib@gmail.com';
        password = '12345678';

        user = new User({
            name: 'habib',
            email,
            password});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
    });

    afterEach( async () => {
        await server.close();
        await User.remove({});
    });

    const exec = () => {
        return request(server)
            .post('/api/auth')
            .send({email, password});

    };

    it('should return 400 if email is invalid', async function () {
        email = '';
        const res = await exec();
        expect(res.status).toBe(400);

    });

    it('should return 400 if password is invalid', async function () {
        password = '';
        const res = await exec();
        expect(res.status).toBe(400);

    });

    it('should return 400 if user is not found', async function () {

        await User.remove({});

        const res = await exec();
        expect(res.status).toBe(400);

    });

    it('should return 400 if paswword is invalid', async function () {

        password = '12345679';
        const res = await exec();
        expect(res.status).toBe(400);

    });

    it('should return authToken if input is valid', async function () {
        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body).not.toBeNull();
    });


});