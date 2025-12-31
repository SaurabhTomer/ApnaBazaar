import dotenv from 'dotenv'
dotenv.config();

import app from "./src/app.js";
import { connectDb } from './src/config/db.js';
import redis from './src/config/redis.js';


const port = process.env.PORT || 3000 ;


connectDb();

app.get("/redis-test", async (req, res) => {
  await redis.set("fromNode", "working", "EX", 60);
  const value = await redis.get("fromNode");
  res.json({ redisValue: value });
});


app.listen(port , () => {
    console.log(`Server is running at port ${port}`);
    
})

