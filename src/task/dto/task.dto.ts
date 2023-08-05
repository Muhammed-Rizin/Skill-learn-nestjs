export interface Task {
    user : String,
    task : string,
    description : string,
    endtime : Date,
}

export interface CompleteTask {
    from : string,
    to : string,
    task : string,
    description : string,
    endtime : string,
    completed : boolean
}