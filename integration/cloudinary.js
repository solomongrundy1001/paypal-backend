const cloudinary = require("cloudinary").v2
require("dotenv").config()


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME?.trim(), 
    api_key: process.env.API_KEY?.trim(), 
    api_secret: process.env.API_SECRET?.trim(),
});

module.exports = cloudinary;