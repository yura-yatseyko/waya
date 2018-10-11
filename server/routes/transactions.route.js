const express = require('express');
const lodash = require('lodash');
var bodyParser = require('body-parser');

var {authenticate} = require('../middleware/authenticate');
const {Transaction} = require('../models/transaction.model');

const router = express.Router();

router.use(bodyParser.json());

router.post('/transactions', authenticate, (req, res) => {
    var body = lodash.pick(req.body, ['recipient', 'sendAmount', 'receiveAmount']);
    
    var transaction = new Transaction(body);
    transaction.transactionTime = new Date();
    transaction.transactionType = 'Payment'
    transaction.transactionStatus = 'In Process'

    transaction.save().then((doc) => {
        res.send({
            success: true,
            data: doc
          });
      }, (err) => {
          res.status(400).send(err);
      });
    
});

router.get('/transactions', authenticate, (req, res) => {
    Transaction.find().then((transactions) => {
        res.send({
            success: true,
            data: transactions
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

module.exports = router;