import dotenv from 'dotenv'
dotenv.config();


import app from '../product/src/app.js'
import { connectDb } from './src/config/db.js';

const port = process.env.PORT || 3001;


connectDb();


app.listen(port , () =>{
    console.log(`server started at port ${port}`);
})
