const mongoose = require("mongoose");

const schema = mongoose.Schema

const CardSchema = new schema({
    card_number : {
        type : String,
        required : true
    },
    card_type : {
        type : String,
        required : true,
        enum : ["Amazon", "Apple", "Razer Gold", "Steam"],
        default : "Razor Gold"
    },
    card_image : {
        type : String,
        required : true,
    },
    user_id : {
        type : mongoose.Types.ObjectId,
        ref : "users"
    }
}, { timestamps: true })

const CardModel = mongoose.model("cards", CardSchema)

module.exports = CardModel;
