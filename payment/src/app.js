import express from 'express'
import cookieParser from 'cookie-parser';
import paymentRouter from './routes/payment.route.js';

const app = express()

app.use(cookieParser())
app.use(express.json())


app.use('/api/payments' , paymentRouter)

export default app;