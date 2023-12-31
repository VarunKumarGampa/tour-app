const User = require("./../models/userModel")
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
// const AppError = require("./../utils/appError")
const factory = require('./handlerFactory')
const multer = require('multer')

const multerStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/img/users')
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split('/')[1]
        cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
    }
})

const multerFilter = (req,file,cb)=>{
    if(req.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{
        cb(new AppError('Not an image! please upload an image',400),false)
    }
}
const upload = multer({storage:multerStorage,fileFilter:multerFilter})


exports.uploadUserPhoto = upload.single('photo')

const filterObj =(obj, ...allowedFeilds)=>{
    const newObj = {}
    Object.keys(obj).forEach(el =>{
        if(allowedFeilds.includes(el)){
            newObj[el] = obj[el]
        }
    })
    return newObj
}   

exports.getAllUsers = factory.getAll(User)
exports.getUsers = factory.getOne(User)
exports.updateUsers =factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)

exports.getMe = (req,res,next)=>{
    req.params.id = req.user.id
    next()
}

exports.updateMe = catchAsync(async(req, res, next)=>{
    //1. create error if user POSTs password date
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError(`This route is not password update, Please use /UpdatePassword`,400))
    }
    //2. Filtered out the unwanted feilds  names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email")
    if(req.file) filteredBody.photo = req.file.filename
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