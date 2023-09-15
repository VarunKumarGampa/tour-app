const mongoose = required('mongoose')

const reviewSchema = mongoose.Schema({
    review : {
        type:String,
        required:[true,'Review cannot be empty!']
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    tour :{
        type: mongoose.Schema.ObjectId,
        ref : "tour",
        required:[true, 'Review must be belong to a tour.']
    },
    user :{
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required: [true, 'Review must be belong to a user']
    }
},{
    toJSON :{ virtuals : true},
    toObject : { virtuals : true}
})

const review = mongoose.model('Review' ,reviewSchema)

module.exports = review