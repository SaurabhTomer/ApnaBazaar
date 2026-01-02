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
    const user = await userModel.findOne({ $or: [{ email }, { username }] }).select('+password');

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

export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    message: "Current user fetched successfully",
    user: req.user
  });
}


export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    // console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //  Add token to Redis blacklist (SET)
    await redis.set(
      `blacklist:${token}`,
      "true",
      "EX",
      24 * 60 * 60 // 1 day
    );

 

    //  Clear cookie
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

export const addUseraddress = async (req, res) => {
  try {
    const id = req.user.id;

    const { state, street, city, pincode, country, phone, isDefault } = req.body;


     // If new address is default → unset previous defaults
    if (isDefault === true) {
      await userModel.updateOne(
       { _id: id },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }

    const user = await userModel.findByIdAndUpdate({ _id: id },

      {
        $push: {
          addresses: {
            state,
            city,
            street,
            pincode,
            country,
            phone,
            isDefault
          }
        }
      },
      { new: true },
    )
    if (!user) {
      return res.status(404).json({ message: "No user found" })
    }

    return res.status(200).json({
      message: "user address add successfully",
      addresses: user.addresses[user.addresses.length - 1]
    })
  } catch (error) {
    return res.status(500).json({ message: "internal server error" })
  }

}


export const getUserAddress = async (req, res) => {
  try {

    const id = req.user.id;

    const user = await userModel.findById(id).select('addresses');

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({
      message: "User address fetch successsfully",
      addresses: user.addresses
    })

  } catch (error) {
    console.log(`get user addresses error ${error.message}`);

    return res.status(500).json({ message: "Internal server error" })
  }

}

export const deleteUserAddress = async (req, res) => {
  try {
    const id = req.user.id;
    const { addressId } = req.params;


    const isAddressExists = await userModel.findOne({ _id: id, 'addresses._id': addressId });


    if (!isAddressExists) {
      return res.status(404).json({ message: "Address not found" });
    }

    const user = await userModel.findOneAndUpdate({ _id: id }, {
      $pull: {
        addresses: { _id: addressId }
      }
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressExists = user.addresses.some(addr => addr._id.toString() === addressId);
    if (addressExists) {
      return res.status(500).json({ message: "Failed to delete address" });
    }

    return res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses
    });

  } catch (error) {
    console.log(`get user addresses error ${error.message}`);

    return res.status(500).json({ message: "Internal server error" })
  }

}