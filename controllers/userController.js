const User = require("./../models/userModel")
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
// const AppError = require("./../utils/appError")
const factory = require('./handlerFactory')

const filterObj =(obj, ...allowedFeilds)=>{
    const newObj = {}
    Object.keys(obj).forEach(el =>{
        if(allowedFeilds.includes(el)){
            newObj[el] = obj[el]
        }
    })
    return newObj
}   

exports.getAllUsers = catchAsync(async(req,res,next)=>{
    const Users = await User.find();
        //Response
        res.status(200).json({
            message : "success",
            result:Users.length,
            data:{
                Users
            }
        })
})
exports. createUsers = (req,res)=>{
    res.status(500).json({
        status: "fail",
        message:"This route is not yet defined"
    })
}

exports.getUsers = (req,res)=>{
    res.status(500).json({
        status: "fail",
        message:"This route is not yet defined"
    })
}

exports.updateUsers = (req,res)=>{
    res.status(500).json({
        status: "fail",
        message:"This route is not yet defined"
    })
}

exports.deleteUser = factory.deleteOne(User)


exports.updateMe = catchAsync(async(req, res, next)=>{
    //1. create error if user POSTs password date
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError(`This route is not password update, Please use /UpdatePassword`,400))
    }
    //2. Filtered out the unwanted feilds  names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email")
    //3. Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new:true,
        runValidator : true 
    })

    res.status(200).json({
        status : 'success',
        data : {
            user : updatedUser
        }
    })
})

exports.deleteMe=catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id, {active : false})

    res.status(204).json({
        status : "success",
        data: null
    })
})