import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';

import userRoutes from './routes/user.js';
import scooterRoutes from './routes/scooter.js';

// Initialize Express
const app = express();

app.use(bodyParser.json());

// Routes
app.use('/scooter', scooterRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    console.log('Test');

    res.send('Hello');
});

app.listen(process.env.PORT);