const mongoose = require("mongoose")
require("dotenv").config()
const AdminModel = require("./models/admin.model")

const createSuperAdmin = async()=>{
   mongoose.connect(process.env.MONGO_DB_URI);

   try{
    const adminExist = await AdminModel.findOne({email : process.env.SUPERUSER_EMAIL })
    if(adminExist){
        console.log("admin already exist")
        return;
    }
    const newAdmin = await AdminModel.create({
        email: process.env.SUPERUSER_EMAIL,
        password: process.env.SUPERUSER_PWD
    })
    if(newAdmin){
        console.log("admin successfully created")
    }

   }catch(error){
    console.log(error.message)
   }
}

createSuperAdmin()