import cookieParser from 'cookie-parser';
import express from 'express'
import cartRouter from './routes/cart.route.js';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));  // This parses URL-encoded bodies
app.use(cookieParser())


//API
app.use('/api/cart' , cartRouter);


export default app;