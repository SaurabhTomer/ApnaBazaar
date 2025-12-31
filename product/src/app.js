import express from 'express'
import cookieParser from 'cookie-parser';
import productRouter from './routes/product.route.js';

const app = express();

app.use(cookieParser());
app.use(express.json());


app.use("/api/products" , productRouter)

export default app;