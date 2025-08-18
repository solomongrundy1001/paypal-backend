const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

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

}, { timestamps: true })

AdminSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    try{
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
        next()
    }catch(error){
        console.log(error)
        next(error)
    }

})

AdminSchema.methods.validatePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Password validation error:', error.message);
    return false;
  }
};

const AdminModel = mongoose.model( "admins" , AdminSchema)

module.exports = AdminModel