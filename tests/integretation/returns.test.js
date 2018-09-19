const moment = require('moment');
const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');



describe('/api/retuns', ()=>{
    let server;
    let movieId;
    let customerId;
    let movie;
    let rental;
    let token;
    const exec = () =>{
       return  request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId, movieId});
    };

    beforeEach(async () => {
        server = require('../../index');

        movieId = mongoose.Types.ObjectId();
        customerId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {
                name: '12345'
            },
            numberInStock: 10
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie:  {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        await rental.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});

    });


    it('should return 400 if client is not logged in', async function () {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId in not provided', async () => {
        customerId = "";

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided',  async () => {
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental is found for this movie/customer', async () => {

        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already proccessed', async () => {

        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });


    it('should return 200 if we have a valid request', async ()=>{
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the returnDate if we have a valid request', async () => {
         await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(10*1000);
    });

    it('should set rental fee if we have a valid request', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the movie stock if input is valid', async () => {

        await exec();
        const movieInDb = await Movie.findById(movie._id);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);

    });

    it('should return the rental if input is valid', async function () {
        const res = await exec();

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(
            ['dateOut', 'dateReturned', 'rentalFee','movie',  'customer']
        ));
    });
});