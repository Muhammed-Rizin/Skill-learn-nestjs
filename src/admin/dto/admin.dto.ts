
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
    emailVerified ?: boolean
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
    emailVerified ?: boolean
    experience ?: string
    payment ?: number
    skills ?: string[]
    approved ?: boolean
    rejected?: boolean
}