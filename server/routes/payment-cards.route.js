const express = require('express');
const lodash = require('lodash');
var bodyParser = require('body-parser');

var {authenticate} = require('../middleware/authenticate');
const {PaymentCard} = require('../models/payment-card.model');

const router = express.Router();

router.use(bodyParser.json());

router.post('/paymentcards', authenticate, (req, res) => {
    var body = lodash.pick(req.body, ['cardNumber', 'cardHolderName', 'validThru', 'type']);
    
    var paymentCard = new PaymentCard(body);
    paymentCard._creator = req.user._id

    paymentCard.save().then((doc) => {
        res.send({
            success: true,
            data: doc
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

router.get('/paymentcards', authenticate, (req, res) => {
    PaymentCard.find({
        _creator: req.user._id
    }).then((paymentCards) => {
        res.send({
            success: true,
            data: paymentCards
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

module.exports = router;