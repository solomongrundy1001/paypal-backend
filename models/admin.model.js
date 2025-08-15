const mongoose = require("mongoose")

const schema = mongoose.Schema

const AdminSchema = new schema({
    email : {
        type : String,
        required : [true, 'Email is required'],
        unique : true
    },
    password : {
        type: String,
        required: [true, 'Password is required'] 
    },
    role : {
        type : String,
        default : "admin"
    }

})


const AdminModel = mongoose.model( "admins" , AdminSchema)

module.exports = AdminModel