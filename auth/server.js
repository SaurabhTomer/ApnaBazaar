import dotenv from 'dotenv'
dotenv.config();

import app from "./src/app.js";
import { connectDb } from './src/config/db.js';


const port = process.env.PORT || 3000 ;



connectDb();

app.listen(port , () => {
    console.log(`Server is running at port ${port}`);
    
})

