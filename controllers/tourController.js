const Tour = require("./../models/tourModel")
const APIFeatures = require("./../utils/apiFeatures")
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
exports.aliasTopTours=(req, res, next)=>{
    req.query.limit='5'
    req.query.sort="-ratingsAverage,price"
    // req.query.fields="name,price,ratingsAverage,summary,difficulty"
    next()
}
 
exports.getAllTour = catchAsync(async(req,res,next)=>{

        //Execute the query
        // console.log(req.query)
        let Features = new APIFeatures(Tour.find(),req.query).filter();
        Features= Features.sort()
        Features=Features.limitFields()
        Features=Features.paginate()
        console.log(`all tour`)
        const tours = await Features.query;
        // console.log(req.query,queryObj);

        //Response
        res.status(200).json({
            message : "success",
            result:tours.length,
            data:{
                tours
            }
        }) 
});
exports.createTour = catchAsync(async(req,res,next)=>{
    // console.log(req.body)
    const newTour = await Tour.create(req.body)
    res.status(200).json({
        status:"success",
        message:`new tour: ${newTour}`
    })


})
exports.getTour = catchAsync(async(req,res,next)=>{
        const tour = await Tour.findById(req.params.id)
        console.log(tour)
        if(!tour){
           return next(new AppError(`no tour find with the ID`, 404))
        }

        res.status(200).json({
            status: 'success',
            message: tour
        }) 
})

exports.updateTour = catchAsync(async(req,res,next)=>{
    console.log(`body ${req.body}`);
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators : true
        })

        if(!tour){
            return next(new AppError(`no tour find with the ID`, 404))
         }

        res.status(200).json({
            status: 'success',
            message: tour
        })
   
});
exports.deleteTour = catchAsync(async(req,res,next)=>{
     const tour = await Tour.findByIdAndDelete(req.params.id)

     if(!tour){
        return next(new AppError(`no tour find with the ID`, 404))
     }

        res.status(200).json({
            status: 'success',
            message: "deleted!!"
        })
})

exports.getTourStat = catchAsync(async(req,res,next)=>{
   
        const stat = await Tour.aggregate([
            {
                $match : { ratingsAverage : {$gte : 4.5}}
            },
            {
                $group : {
                    _id:{$toUpper : '$difficulty'},
                    numTours : {$sum : 1},
                    numRating : {$sum : '$ratingsQuantity'},
                    avgRating : {$avg : '$ratingsAverage'},
                    avgPrice : {$avg : '$price'},
                    minPrice : {$min : '$price'},
                    maxPrice : {$max : '$price'}
                }
            },
            // {
            //     // $match : { _id : {$ne : 'EASY'}}
            // }
        ])
        res.status(200).json({
            status: 'success',
            message: stat
        })  
})

exports.getMonthlyPlan = catchAsync(async (req,res,next)=>{
        const year = req.params.year * 1
        let start = `${year}-01-01`;
        let end = `${year}-12-31`
        const plan = await Tour.aggregate([
            {
                $unwind : '$startDates'
            },
            {
               $match: {
                startDates: {
                    $gt: start ,
                     $lt: end
                  }
                }
              },
              {$project:
                { 
                    startDates:
                    {$dateFromString:{dateString:'$startDates'}
                }
                }
            },
            {
                $group : {
                    _id : { $month : '$startDates'},
                    numTourStarts : {$sum : 1},
                    tour: { $push: '$name' }
                }
              },
              {
                $addFields: { month: '$_id' }
              },
              {
                $project: {
                  _id: 0
                }
              },
              {
                $sort: { numTourStarts: -1 }
              },
              {
                $limit: 12
              }
            
        ])
        res.status(200).json({
            status: 'success',
            message: {plan}
        })
})