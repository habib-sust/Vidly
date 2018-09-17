const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255


    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: 8,
        maxLength: 1024
    },

    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
};
const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(8).max(255).required()
    };


    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;