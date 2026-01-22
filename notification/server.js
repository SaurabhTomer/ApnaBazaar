import dotenv from 'dotenv'
dotenv.config();

import app from "./src/app.js";


app.listen(3006 , ()=>{
    console.log("Notification service is running on port 3006");   
})