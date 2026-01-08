import dotenv from 'dotenv'
dotenv.config()

import app from "./src/app.js";
import { connectDb } from './src/config/db.js';



const port = process.env.PORT || 3004;

connectDb();

app.listen(port , () => {
    console.log(`payment service running on port ${port}`);
    
})