const express = require('express');
const lodash = require('lodash');
var multer  = require('multer');

var {authenticate} = require('../middleware/authenticate');

const {Country} = require('../models/country.model');

const router = express.Router();

router.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({storage: storage});
var countryFlagUpload = upload.single('countryFlagImage');

router.post('/countries', authenticate, countryFlagUpload, (req, res) => {  
  var body = lodash.pick(req.body, ['name']);
  var country = new Country(body);
  country.flagImageURL = req.file.path;
    
  country.save().then((doc) => {
      res.send({
          success: true,
          data: doc
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

router.get('/countries', authenticate, (req, res) => {
    Country.find().then((countries) => {
        res.send({
            success: true,
            data: countries
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

module.exports = router;