import * as mongoose from 'mongoose'

export const adminSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    token : {
        type : String
    }
})
