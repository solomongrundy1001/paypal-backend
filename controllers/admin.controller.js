const AdminModel = require("../models/admin.model")
const jwt = require("jsonwebtoken")
require("dotenv").config()


const Login = async(req, res)=>{
    console.log("REQ.BODY:", req.body);

    const {email, password} = req.body;
    console.log("did you run?")
    try{
        const admin = await AdminModel.findOne({email});
        if(!admin){
            return res.status(404).json({
                message: "account with the email address not found",
                data : null,
                success : false
            })
        }
        const isValid = await admin.validatePassword(password)
        if(!isValid){
            return res.status(401).json({
                message: "invalid password",
                data : null,
                success : false
            })
        }

        const token =  jwt.sign({email : admin.email, role : admin.role}, process.env.JWT_SECRET, { expiresIn: "1d" } );

        return res.status(201).json({
            message : "Logged in successfully",
            data : {
                token
            },
            success: true
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            message : "unexpected server error" + error.message,
            success : false,
            data : null
        });
    }
}

// const CreateUser = async(req, res)=>{

//     try{
    
//     }catch(error){
    
//     }

// }

module.exports = {
    Login,
}