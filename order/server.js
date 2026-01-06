import dotenv from 'dotenv'
dotenv.config()


import app from "./app.js";
import { connectDb } from "./src/config/db.js";





connectDb();

app.listen( port , () => {
    console.log(`order service running at port ${PORT}`);
})