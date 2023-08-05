import * as mongoose from 'mongoose'

export const professionalSchema = new mongoose.Schema({
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
    qualification: {
        type: String
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
    experience: {
        type: String
    },
    payment: {
        type: Number,
        default : 0
    },
    skill: {
        type: Array
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
    approved: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    },
    field : {
        type : String,
    },
    work : {
        type : String,
    },
    emailToken: {
        type: String
    },
    about  : {
        type : String
    }

})

export interface Professional {
    _id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    education: string
    google?: boolean
    blocked?: boolean
    __v?: number
    token?: string
    location ?: string
    bio ?: string
    address ?: string
    image ?: string
    emailverified ?: boolean
    experience ?: string
    payment ?: number
    skills ?: string[]
    approved ?: boolean
    rejected?: boolean
    field?: string
    work?: string
    qualification?: string
    emailToken?: string
    about?: string
}