var mongoose = require('mongoose')
require('mongoose-double')(mongoose);
 
var SchemaTypes = mongoose.Schema.Types;

var Transaction = mongoose.model('Transaction', {
    recipient: {
        name: {
            type: String
        },
        email: {
            type: String
        }
    },
    sendAmount: {
        type: SchemaTypes.Double
    },
    receiveAmount: {
        type: SchemaTypes.Double
    },
    transactionTime: {
        type: Number
    },
    transactionType: {
        type: String,
        enum: ['Payment', 'Transfer']
    },
    transactionStatus: {
        type: String,
        enum: ['Failed', 'In Process', 'Founds Delivered']
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {Transaction};

