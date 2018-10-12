const express = require('express');
const lodash = require('lodash');
var bodyParser = require('body-parser');

var {authenticate} = require('../middleware/authenticate');

const router = express.Router();

router.use(bodyParser.json());

router.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

router.post('/users/update', authenticate, (req, res) => {
  var body = lodash.pick(req.body, ['email', 'phone', 'name']);

  req.user.updateUserData(body).then((user) => {
    res.status(200).send({
        success: true,
        data: user
    });
  }, () => {
    res.status(400).send();
  });
});

module.exports = router;