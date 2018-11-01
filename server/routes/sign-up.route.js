const express = require('express');
const lodash = require('lodash');
const bodyParser = require('body-parser');

const {User} = require('../models/user.model');

const router = express.Router();

router.use(bodyParser.json());

router.post('/signup', (req, res) => {  
    var body = lodash.pick(req.body, ['email', 'phone', 'phoneNumberCode', 'name', 'password', 'pinNumber']);
    
    var user = new User(body);
    
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send({
          success: true,
          data: user
        });
    }).catch((e) => {
      res.status(400).send(e);
    });
});

module.exports = router;