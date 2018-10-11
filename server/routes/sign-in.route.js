const express = require('express');
const lodash = require('lodash');
var bodyParser = require('body-parser');

var {authenticate} = require('../middleware/authenticate');
const {User} = require('../models/user.model');

const router = express.Router();

router.use(bodyParser.json());

router.post('/signin', (req, res) => {
    var body = lodash.pick(req.body, ['emailOrPhone', 'password']);
  
    User.findByCredentials(body.emailOrPhone, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send({
            success: true,
            data: user
        });
      });
    }).catch((e) => {
      res.status(400).send();
    });
});

router.post('/signin/pin', authenticate, (req, res) => {
  var body = lodash.pick(req.body, ['pinNumber']);

  req.user.checkPinNumber(body.pinNumber).then(() => {
    res.status(200).send({
        success: true,
        data: {
        }
    });
  }, () => {
    res.status(400).send();
  });
});

module.exports = router;