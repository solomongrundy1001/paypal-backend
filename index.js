const express = require('express')
require("dotenv").config()
const cors = require("cors")
const bodyParser = require("body-parser")

const connectDB = require('./db')
const routes = require('./routes/admin.routes')

const PORT = process.env.PORT || 8080

const app = express()
connectDB()
// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin : "http://localhost:5173"
}))

// routes
app.use("/api/superuser", routes)

app.get("/", (req , res)=>{
    res.send("this is working")
})

app.use((error, req, res, next) => {
  const path = req.path;
  const status = error.status || 500; 

  const message =
    status >= 500
      ? `Unexpected server error: ${error.message}`
      : `An error occurred: ${error.message}`;

  return res.status(status).json({ path, message });
});

app.listen(PORT, () =>{
    console.log("server is running on port: " + PORT)
})

