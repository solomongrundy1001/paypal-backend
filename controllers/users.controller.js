const cloudinary = require("../integration/cloudinary");
const CardModel = require("../models/card.model");
const fs = require("fs");
const mongoose = require("mongoose");

const PostCard = async (req, res) => {
  const { card_number, card_type } = req.body;
  const userId = req.params.userId;
  const card_image = req.file;
  console.log(userId)

  if (!card_number || !card_type) {
    return res.status(400).json({
      message: "All fields are required",
      data: null,
      success: false,
    });
  }

  try {
    let cardUrl;
    if (card_image && card_image.path) {
      const response = await cloudinary.uploader.upload(card_image.path);
      // Delete the file from the server after uploading to Cloudinary
      fs.unlink(card_image.path, (err) => {
        if (err) {
          console.log("Error deleting file: ", err);
        } else {
          console.log("File deleted successfully");
        }
      });
      cardUrl = response.secure_url;
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
        success: false,
      });
    }
    const card = new CardModel({
      card_number,
      card_type,
      card_image: cardUrl,
      user_id: userId,
    });

    await card.save();

    return res.status(201).json({
      message: "Successful, Hold while we validate your payment",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Unable to Confirm payment at this time, try again later",
      data: null,
      success: false,
    });
  }
};

module.exports = {
  PostCard,
};
