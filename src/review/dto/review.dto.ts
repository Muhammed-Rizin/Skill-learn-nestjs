export interface addReview {
    title : string
    description : string
    rating : number
}

export interface Review {
    title : string,
    description : string
    rating : number
    _id : string
    user : string 
    professional : string
    createdAt : Date
}