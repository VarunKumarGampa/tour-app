const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require("./../utils/apiFeatures")

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No document find with the ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'deleted!!',
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(`body ${req.body}`);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`no tour find with the ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.body)
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      message: `new doc: ${doc}`,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    console.log(doc);
    if (!doc) {
      return next(new AppError(`no tour find with the ID`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

exports.getAll = Model => 
    catchAsync(async(req,res,next)=>{
    let filter = {}
    if(req.params.tourId) filter = {tour:req.params.tourId}
    //Execute the query
    // console.log(req.query)
    let Features = new APIFeatures(Model.find(filter),req.query).filter();
    Features= Features.sort()
    Features=Features.limitFields()
    Features=Features.paginate()
    const doc = await Features.query;
    // console.log(req.query,queryObj);

    //Response
    res.status(200).json({
        message : "success",
        result:doc.length,
        data:{
            data : doc
        }
    }) 
});
