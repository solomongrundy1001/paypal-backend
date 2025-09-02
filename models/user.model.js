const mongoose = require("mongoose")

const schema = mongoose.Schema

const UserSchema = new schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    username : {
        type: String
    },
    amount : {
        type: String,
    },
    avatar : {
        type : String,
    },
    role : {
        type : String,
        default : "user"
    }
    
}, { timestamps: true })


const UserModel = mongoose.model( "users" , UserSchema)

module.exports = UserModel