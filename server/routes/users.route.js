const express = require('express');

var {authenticate} = require('../middleware/authenticate');

const router = express.Router();

router.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
  });

module.exports = router;