var mongoose = require('mongoose');

var Country = mongoose.model('Country', {
  name: {
    type: String
  },
  flagImageURL: {
      type: String
  }
});

module.exports = {Country};