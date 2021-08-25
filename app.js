const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const authRouter = require('./routes/auth');
const propertyRouter = require('./routes/property');
const tenantRouter = require('./routes/tenant');
const settingRouter = require('./routes/setting');

const app = express();

app.use(bodyParser.json()); // For => application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});

app.use('/auth', authRouter);
app.use('/property', propertyRouter);
app.use('/tenants', tenantRouter);
app.use('/settings', settingRouter);

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    console.log('Error: ');
    console.log(message);
    res.status(statusCode).json({ error: { message: message }, data: data });
});

mongoose.connect('mongodb+srv://sahire:whatispas@cluster0.1famb.mongodb.net/property-server?retryWrites=true&w=majority')
    .then(result => {
        console.log('Connected to DB...');
        app.listen(8080);
    })
    .catch(err => console.log(err));
