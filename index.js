const express = require('express')
require("dotenv").config()

const PORT = process.env.PORT || 8080
const app = express()

app.get("/", (req , res)=>{
    res.send("this is working")
})

app.listen(PORT, () =>{
    console.log("server is running on port: " + PORT)
})

