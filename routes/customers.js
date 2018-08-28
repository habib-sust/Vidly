const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

// Create Customer Model With Schema
const Customer  = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    phone: {
        type: String,
        minLength: 11,
        required: true
    }

}));

//get All Customer
router.get('/', async (req, res) => {

    const customers = await Customer.find();
    res.send(customers);
});

//create a new Customer
router.post('/', async (req, res) => {
try {
    const { error } = validCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    customer = await customer.save();

    res.send(customer);
} catch (error) {
    res.send(error);
}

});

//get a customer based on ID
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('the customer with the given id was not found');

    res.send(customer);
});

//Delete a customer
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('the customer with the given id was not found');

    res.send(customer);
});

// Update a customer
router.put('/:id', async (req, res) => {
    const { error } = validCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer().findByIdAndUpdate(req,params.id, {
        $set: {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        }
    });

    if (!customer) return res.status(404).send('the customer with the given id was not found')
    res.send(customer);
});
//Customer Validation
function validCustomer(customer) {
    const schema = {
        isGold: Joi.boolean(),
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(11).required()
    };

    return Joi.validate(customer, schema);
}

module.exports = router;