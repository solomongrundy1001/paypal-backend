const userController = require("../controllers/users.controller")
const express = require("express")
const multer = require("multer")

const userRoute = express.Router()
const upload = multer({dest : "uploads/"})

userRoute.post("/user/:userId/card-payment/confirmation", upload.single("card_image"), userController.PostCard);


module.exports = userRoute;