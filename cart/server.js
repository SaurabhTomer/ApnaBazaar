import dotenv from 'dotenv'
dotenv.config()
import app from "./src/app.js";
import { connectDb } from "./src/config/db.js";

const port = process.env.PORT || 3002 ;





//connect database
connectDb();

app.listen(port , () => {
    console.log(`cart server running on port ${port}`);   
})