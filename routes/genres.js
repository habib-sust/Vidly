const {Genre, validateGenre} = require('../models/genre');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {

        const genres = await Genre.find().sort('name');
        res.send(genres);

});

router.post('/', [auth, validate(validateGenre)], async (req, res) => {
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', [validateObjectId, auth, validate(validateGenre)], async (req, res) => {

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {new: true});

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

module.exports = router;