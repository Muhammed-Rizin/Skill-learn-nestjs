import * as mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    birthday: {
        type: Date
    },
    bio: {
        type: String
    },
    address: {
        type: String
    },
    image: {
        type: String
    },
    google: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default : false
    },
    token: {
        type: String
    },
    emailToken: {
        type: String
    },
    notificationToken : {
        type : String
    }
})
