import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";


export const registerUser = async (req, res) => {
  try {
    //fetch data
    const {
      username,
      email,
      password,
      fullName: { firstName, lastName },
      role,
    } = req.body;
    
    //check user exits with this email or username
    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    //if user exists
    if (isUserAlreadyExists) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    //hash pass
    const hash = await bcrypt.hash(password, 10);
    //create user
    const user = await userModel.create({
      username,
      email,
      password: hash,
      fullName: { firstName, lastName },
      role: role || "user", // default role is 'user'
    });

    //generate token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //save token in cookie
    res.cookie("token", token, {
      httpOnly: true,
       secure: false,     // 👈 MUST be false in localhost
  sameSite: "lax", 
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    //return response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
   try {
        const { username, email, password } = req.body;

        // find user with password selected
        const user = await userModel.findOne({ $or: [ { email }, { username } ] }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

               res.cookie('token', token, {
            httpOnly: true,
            secure: false,     // 👈 MUST be false in localhost
  sameSite: "lax", 
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                addresses: user.addresses
            }
        });
    } catch (err) {
        console.error('Error in loginUser:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }

};

export const getCurrentUser = async (req,res) => {
  return res.status(200).json({
    message:"Current user fetched successfully",
    user:req.user
  });
}
export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ STEP 1: Add token to Redis blacklist (SET)
    await redis.set(
      `blacklist:${token}`,
      "true",
      "EX",
      24 * 60 * 60 // 1 day
    );

    
    // ✅ STEP 2: Clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,       // true only in production (HTTPS)
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout successfully",
    });

  } catch (err) {
    console.error("Error in logout:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
