import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRoutes from './routes/user.js';
import scooterRoutes from './routes/scooter.js';
import serviceRoutes from './routes/service.js';

// Initialize Express
const app = express();

app.use(cors());

app.use(bodyParser.json());

// Routes
app.use('/scooter', scooterRoutes);
app.use('/user', userRoutes);
app.use('/service', serviceRoutes);

app.get('/', (req, res) => {
    console.log('Test');

    res.send('Hello');
});

app.listen(process.env.PORT);