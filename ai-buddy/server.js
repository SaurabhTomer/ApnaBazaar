import dotenv from 'dotenv'
dotenv.config()

import app from "./src/app.js";
import http from 'http'
import { initSocketServer } from "./src/sockets/socket.server.js";

const port = process.env.PORT || 3005;


const httpServer = http.createServer(app);

initSocketServer(httpServer);

httpServer.listen(port , ()=>{
    console.log(`AI buddy service running on port ${port}`);
})