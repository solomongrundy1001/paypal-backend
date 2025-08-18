const express = require("express")
const adminController = require("../controllers/admin.controller")
const validateAdminToken = require("../middleware/validateToken")
const multer = require("multer")

const routes = express.Router()
const upload = multer({ dest: "uploads/" });

routes.post("/create-user", upload.single('avatar'), validateAdminToken, adminController.CreateUser)
routes.post("/auth/login", adminController.Login)


module.exports = routes