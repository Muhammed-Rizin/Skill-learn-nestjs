import * as mongoose from 'mongoose'

export const paymentSchema = new mongoose.Schema({
    from: {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref: "User"
    },
    to: {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref: "Professional"
    },
    amount: {
        type : Number,
        required : true
    },
    paymentId: {
        type : String,
        required : true
    }
},
{
    timestamps : true
}
)