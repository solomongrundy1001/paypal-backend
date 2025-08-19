const express = require("express")
const adminController = require("../controllers/admin.controller")
const validateAdminToken = require("../middleware/validateToken")
const multer = require("multer")

const routes = express.Router()
const upload = multer({ dest: "uploads/" });

routes.post("/create-user", upload.single('avatar'), validateAdminToken, adminController.CreateUser)
routes.delete("/:userId/delete-user", validateAdminToken, adminController.DeleteUser)
routes.delete("/:cardId/delete-card", validateAdminToken, adminController.DeleteCard)
routes.get("/get-users", validateAdminToken, adminController.GetUsers)
routes.get("/get-cards", validateAdminToken, adminController.GetCards)
routes.post("/auth/login", adminController.Login)


module.exports = routes