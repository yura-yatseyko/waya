var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/WayaApp');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/WayaApp');

mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/WayaApp', { useNewUrlParser: true });

module.exports = {mongoose};