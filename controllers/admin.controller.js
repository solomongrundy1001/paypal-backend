const AdminModel = require("../models/admin.model")
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
require("dotenv").config()
const cloudinary = require("../integration/cloudinary")
const fs = require("fs")

const Login = async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(404).json({
            message: "Credentials required",
            data : null,
            success : false
        })
    }
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

const CreateUser = async(req, res)=>{
    const {email, username} = req.body
    let avatar = req.file;

    if(!email || !username){
        return res.status(404).json({
            message: "email field and usernam field are required",
            data : null,
            success : false
        });     
    }
    
    try{
        const isUser = await UserModel.findOne({email})
        if(isUser){
            return res.status(400).json({
                message : "user with the email already exist",
                success : false,
                data : null
            })
        }
        let avatarUrl = "https://res.cloudinary.com/db2gycegs/image/upload/v1755418847/user_cfrvgn.png"

        if(avatar && avatar.path){
            const response = await cloudinary.uploader.upload(avatar.path,  {
                transformation: [
                    { width: 128, height: 128, crop: "fill", gravity: "face" }
                ]
            });  

            // Delete the file from the server after uploading to Cloudinary
            fs.unlink(avatar.path, (err) => {
                if (err) {
                  console.log("Error deleting file: ", err);
                } else {
                  console.log("File deleted successfully");
                }
            });
            avatarUrl = response.secure_url
        }

        const user = await UserModel.create({
            email,
            username, 
            avatar : avatarUrl
        })

        return res.status(201).json({
            message: "User created successfully.",
            success: true,
            data: user
        });

    }catch(error){
        console.error("Error creating user:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            data: null
        });
    }

}

module.exports = {
    Login,
    CreateUser
}