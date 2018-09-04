const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3

    },
    email: {
        type: String,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: 8,
        maxLength: 255
    }
}));

function validateUser(user){
    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.strinng().required(),
        password: Joi.string().required()
    };


    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;