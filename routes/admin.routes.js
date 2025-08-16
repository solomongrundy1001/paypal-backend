const express = require("express")
const adminController = require("../controllers/admin.controller")


const routes = express.Router()

routes.post("/auth/login", adminController.Login)




module.exports = routes