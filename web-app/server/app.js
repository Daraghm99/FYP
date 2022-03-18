require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const models = require('./models');
const routes = require('./routes');
const controllers = require('./controllers');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
	res.send('Hello World!');
});



app.listen(process.env.PORT);