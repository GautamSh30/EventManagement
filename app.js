import express from 'express';
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
import cors from 'cors'

import connect from './db/db.js';
import userRoutes from './routes/user.route.js'

connect();
const app = express();

app.use(cors())
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.use('/users', userRoutes)

app.get('/', (req, res) => {
    res.send('Hello world!');
});

export default app;