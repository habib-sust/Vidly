const bcrypt = require('bcrypt');
const {User} = require('../models/user');
const validate = require('../middleware/validate');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

router.post('/', validate(validateAuth), async (req, res) => {

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    const validatePassword = await bcrypt.compare(req.body.password, user.password);

    if (!validatePassword) return res.status(400).send("Invalid email or password.")

    res.send(user.generateAuthToken());

});

function validateAuth(req){
    const schema = {
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(8).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;