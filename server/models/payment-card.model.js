var mongoose = require('mongoose')
require('mongoose-double')(mongoose);
 
var PaymentCard = mongoose.model('PaymentCard', {
    cardNumber: {
        type: String
    },
    cardHolderName: {
        type: String
    },
    validThru: {
        type: String
    },
    type: {
        type: String
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

module.exports = {PaymentCard};