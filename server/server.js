const express = require('express');
var _ = require('./db/mongoose');

var app = express();

const signUpRouter = require('./routes/sign-up.route.js');
const signInRouter = require('./routes/sign-in.route.js');

app.use(signUpRouter);
app.use(signInRouter);

app.get('/', (req, res) => {
    res.send('Server works.');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Started on port ', port);
});