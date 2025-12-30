
import jwt from 'jsonwebtoken'


export const authMiddleware = async (req, res , next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        req.user = decoded; // attach user info to request

        next();

    }

    catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}