const catchAsync = require("./../utils/catchAsync")
const Tour = require("./../models/tourModel")


exports.overview = catchAsync(async(req,res,next)=>{
    //1. Get tour data from collection
    const tours = await Tour.find()
    //2.Build template
    //3.Render that template using tour data from 1)
    res.status(200).render('overview', {
        title:'All Tours',
        tours
    })
})

exports.gettour = catchAsync(async(req,res)=>{
    //1. Get the data from the request tour(including reviews and guide)
    const tour = await Tour.findOne({slug:req.params.slug}).populate({
        path: 'reviews',
        fields:'review rating user'
    })
    console.log(tour)
    //2. Build template
    //3. render the template using tour data from 1)
    res.status(200).render('tour', {
        title:`${tour.name} Tour`,
        tour
    })
})

exports.getLoginForm = catchAsync(async(req,res)=>{
    res.status(200).render('login', {
        title:`Log into your account`
    })
})