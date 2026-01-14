import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

// Function to initialize Socket.IO server
export const initSocketServer = async (httpServer) => {

    // Create a new Socket.IO server and attach it to HTTP server
    const io = new Server(httpServer, {});

    // Socket.IO middleware for authentication
    // This runs BEFORE a client is allowed to connect
    io.use((socket, next) => {

        // Get cookies from socket handshake headers
        const cookies = socket.handshake.headers.cookie;

        // Parse cookies and extract JWT token
        const { token } = cookies ? cookie.parse(cookies) : {};

        // If token is not present, block the connection
        if (!token) {
            return next(new Error("Token not provided"));
        }

        try {
            // Verify JWT token using secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach decoded user data to socket object
            // This can be accessed later as socket.user
            socket.user = decoded;

            // Allow the socket connection
            next();
        } catch (error) {
            // If token is invalid or expired, reject connection
            next(new Error("Invalid token"));
        }
    });

    // This event runs after successful authentication
    io.on("connection", (socket) => {
        console.log("A user connected");

        // Example: access authenticated user data
        // console.log(socket.user);
    });
};
