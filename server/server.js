const express = require('express');
var _ = require('./db/mongoose');

var app = express();

const signUpRouter = require('./routes/sign-up.route.js');
const signInRouter = require('./routes/sign-in.route.js');
const logoutRouter = require('./routes/logout.route.js');
const countriesRouter = require('./routes/countries.route.js');

app.use(signUpRouter);
app.use(signInRouter);
app.use(logoutRouter);
app.use(countriesRouter);

app.get('/', (req, res) => {
    res.send('Server works.');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Started on port ', port);
});