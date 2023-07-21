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

export interface Admin {
    _id?: string
    email: string
    password: string
    __v?: number
    token ?: string
}

export interface User {
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
    birthday ?: Date
    bio ?: string
    address ?: string
    image ?: string
    emailverified ?: boolean
}

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
    birthday ?: Date
    bio ?: string
    address ?: string
    image ?: string
    emailverified ?: boolean
    experience ?: string
    payment ?: number
    skills ?: string[]
    approved ?: boolean
    rejected?: boolean
}