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

exports.gettour = (req,res)=>{
    res.status(200).render('tour', {
        title:'The Forest Hiker'
    })
}

