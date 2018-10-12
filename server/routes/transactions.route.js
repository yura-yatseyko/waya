const express = require('express');
const lodash = require('lodash');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');
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
    transaction._creator = req.user._id

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
    Transaction.find({
        _creator: req.user._id
    }).then((transactions) => {
        res.send({
            success: true,
            data: transactions
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

router.get('/transactions/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Transaction.findById(id).then((transaction) => {
        if (!transaction) {
          return res.status(404).send();
        }
    
        res.send({
            success: true,
            data: transaction
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

module.exports = router;