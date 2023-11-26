
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
    emailVerified ?: boolean
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
    notificationToken?: string
}