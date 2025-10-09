const AdminModel = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
require("dotenv").config();
const cloudinary = require("../integration/cloudinary");
const fs = require("fs");
const CardModel = require("../models/card.model");

const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({
      message: "Credentials required",
      data: null,
      success: false,
    });
  }
  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        message: "account with the email address not found",
        data: null,
        success: false,
      });
    }
    const isValid = await admin.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({
        message: "invalid password",
        data: null,
        success: false,
      });
    }

    const token = jwt.sign(
      { email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Logged in successfully",
      data: {
        token,
      },
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "unexpected server error" + error.message,
      success: false,
      data: null,
    });
  }
};

const CreateUser = async (req, res) => {
  const { email, firstname, lastname, username, amount } = req.body;
  let avatar = req.file;

  if (!email || !firstname || !lastname || !username || !amount) {
    return res.status(404).json({
      message: "All fields required",
      data: null,
      success: false,
    });
  }

  try {
    const isUser = await UserModel.findOne({ email });
    if (isUser) {
      return res.status(400).json({
        message: "user with the email already exist",
        success: false,
        data: null,
      });
    }
    let avatarUrl =
      "https://res.cloudinary.com/db2gycegs/image/upload/v1755418847/user_cfrvgn.png";

    if (avatar && avatar.path) {
      const response = await cloudinary.uploader.upload(avatar.path, {
        transformation: [
          { width: 128, height: 128, crop: "fill", gravity: "face" },
        ],
      });

      // Delete the file from the server after uploading to Cloudinary
      fs.unlink(avatar.path, (err) => {
        if (err) {
          console.log("Error deleting file: ", err);
        } else {
          console.log("File deleted successfully");
        }
      });
      avatarUrl = response.secure_url;
    }

    const user = await UserModel.create({
      email,
      firstname,
      lastname,
      username,
      amount,
      avatar: avatarUrl,
    });

    return res.status(201).json({
      message: "User created successfully.",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      data: null,
    });
  }
};

const DeleteUser = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(404).json({
      message: "User ID missing",
      success: false,
      data: null,
    });
  }
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        data: null,
      });
    }
    await user.deleteOne();

    return res.status(200).json({
      message: "User successfully deleted",
      success: true,
      data: null,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server error, cannot delete user at this time",
      success: false,
      data: null,
    });
  }
};

const DeleteCard = async (req, res) => {
  const cardId = req.params.cardId;
  if (!cardId) {
    return res.status(404).json({
      message: "Card ID missing",
      success: false,
      data: null,
    });
  }
  try {
    const card = await CardModel.findOne({ _id: cardId });
    if (!card) {
      return res.status(404).json({
        message: "card with ID not found",
        success: false,
        data: null,
      });
    }

    await card.deleteOne();
    return res.status(200).json({
      message: "Successfully deleted card details",
      success: true,
      data: null,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "Server error, unable to delete card details at this time",
      success: false,
      data: null,
    });
  }
};

const GetUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    if (!users) {
      return res.status(400).json({
        message: "no user found",
        data: null,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Users successfully retrieved",
      data: users,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server error, cannot retrieve users at this time",
      data: null,
      success: false,
    });
  }
};

const GetCards = async (req, res) => {
  try {
    const cards = await CardModel.aggregate([
      {
        //  just a basic lookup fetches all fields from user collection

        // $lookup: {
        //   from: "users",
        //   localField: "user_id",
        //   foreignField: "_id",
        //   as: "sender_details",
        // },

        // lookup selects required user field
        $lookup: {
          from: "users",
          let: { userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
            {
              $project: {
                username: 1,
                avatar: 1,
                email: 1,
              },
            }, 
          ],
          as: "sender_details",
        },
      },
    ]);
    if (!cards) {
      return res.status(400).json({
        message: "no card found",
        data: null,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Cards successfully retrieved",
      data: cards,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server error, cannot retrieve users at this time",
      data: null,
      success: false,
    });
  }
};

module.exports = {
  Login,
  CreateUser,
  DeleteUser,
  DeleteCard,
  GetUsers,
  GetCards,
};
