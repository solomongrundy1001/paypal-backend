const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_DB_URI)

    mongoose.connection.on("connected", ()=>{
        console.log("database connected successfully")
    })

    mongoose.connection.on("error", (error)=>{
        console.log("failed to connect to database: " + error.message )
    })

}

module.exports = connectDB