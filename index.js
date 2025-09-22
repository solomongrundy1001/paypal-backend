const express = require('express')
require("dotenv").config()
const cors = require("cors")
const bodyParser = require("body-parser")

const connectDB = require('./db')
const routes = require('./routes/admin.routes')
const userRoute = require('./routes/user.routes')

const PORT = process.env.PORT || 8080

const app = express()
connectDB()
// middlewares

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin : process.env.NODE_ENV === "production"?
      "https://paypal-client-liart.vercel.app" : "http://localhost:5173/"
}))

// routes
app.use("/api/superuser", routes)
app.use("/api", userRoute)

app.get("/", (req , res)=>{
  res.send("this is working")
})

app.use((error, req, res, next) => {
  const path = req.path
  console.log(path , error.message )

  const status = error.status || 500; 
  const message =`An error occurred: ${error.message}` || `Unexpected server error: ${error.message}`;

  res.status(status).json({ 
    path, 
    message,
    status
  });
  
});

app.listen(PORT, () =>{
    console.log("server is running on port: " + PORT)
})

