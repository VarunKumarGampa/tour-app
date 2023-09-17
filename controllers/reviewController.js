const Review = require('./../models/reviewModel')
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')

exports.getAllReviews = catchAsync(async (req,res,next)=>{
    const reviews = await Review.find()
    //Response
    res.status(200).json({
        status :"Success",
        result : reviews.length,
        data:{
            reviews
        }
    })
})

exports.createReview= catchAsync(async (req,res,next)=>{
    const newReview = await Review.create(req.body)
    //Response
    res.status(201).json({
        status :"Success",
        data:{
           review: newReview
        }
    })
})