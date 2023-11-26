
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
    emailToken?: string
    notificationToken?: string
}