const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.createOne = Model => catchAsync(async(req,res,next)=>{
    // console.log(req.body)
    const doc = await Model.create(req.body)
    res.status(200).json({
        status:"success",
        message:`new doc: ${doc}`
    })
})