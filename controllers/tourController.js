const Tour = require("./../models/tourModel")

const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')

exports.aliasTopTours=(req, res, next)=>{
    req.query.limit='5'
    req.query.sort="-ratingsAverage,price"
    // req.query.fields="name,price,ratingsAverage,summary,difficulty"
    next()
}
 
exports.getAllTour = factory.getAll(Tour)
exports.createTour = factory.createOne(Tour)
exports.getTour = factory.getOne(Tour, {path:'reviews'})
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)


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

exports.getTourswithin = catchAsync(async(req,res,next)=>{
  const { distance , latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance/3963.2 : distance / 6378.1
  if(!lat, !lng){
    next(new AppError('Please provide lat and lng in the format lng,lat',400))
  }

  const tours = await Tour.find({startLocation : {
    $geoWithin : {
      $centerSphere : [[lng, lat], radius]
    }
  }})

  res.status(200).json({
    message  :'success',
    result : tours.length,
    data : {
      data : tours
    }
  })

})

exports.getdistances = catchAsync(async(req,res,next)=>{
  const {latlng, unit} = req.params;
  console.log(latlng)
  const [lat, lng] = latlng.split(',');

  const multiper = unit === 'mi' ? 0.00062137 : 0.001

  if(!lat, !lng){
    next(new AppError('Please provide lat and lng in the format lng,lat',400))
  }

  const distances = await Tour.aggregate([
    {
      $geoNear : {
        near : {
          type : 'Point',
          coordinates :[lng *1 , lat*1]
        },
        distanceField : 'distance',
        distanceMultiplier: multiper
      }
    },
    {
      $project:{
        distance : 1,
        name : 1
      }
    }

  ])

  res.status(200).json({
    message  :'success',
    data : {
      data : distances
    }
  })
})