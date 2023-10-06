const AppError = require('./../utils/appError')

const handleCastErrorDB = err =>{
    const message = `Invalid ${err.path} : ${err.value}.`
    return new AppError(message, 400)
}
const handleDuplicateFeildDB = err=>{
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    // console.log(err.keyValue.name)
    const message = `dulplicate fields value: ${err.keyValue.name}. Please use another value!`
    return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };
const handleJWTError = err =>{
    new AppError(`Invalid error! please login again`,401)
}
const handleJWTExpiredError = err =>{
    new AppError(`Token has been expired! Please login again`,401)
}
const sendErrorDev = (req,err,res)=>{
    //API
    console.log(req)
    if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json({
            status: err.status,
            error : err,
            message : err.message,
            stack : err.stack
        })
    }else{
        //Rendered website
        res.status(err.statusCode).render('error',{
            title : "somthing went wrong!",
            msg: err.message
        })
    }
}

const sendErrorPROD = (err,req,res)=>{
    //Operational, trusted error : send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message : err.message
        })
    }
    //Programming or other unknow error : don't leak it out side
    else{
        //1) log error
        console.error('Error: ',err)
        //2)send generic error
        res.status(500).json({
            status: 'error',
            message : 'something went wrong!'
        })
    }
}

module.exports = (err, req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(req,err,res)
    }
    else if(process.env.NODE_ENV === 'production'){
        let error = {...err}
        console.log(`hi ${error}`);
        if(error.name === 'CastError'){
           error =  handleCastErrorDB(error)
        }
        if(error.code === 11000) error = handleDuplicateFeildDB(error)
        if(error.name === 'ValidationError'){ 
            error = handleValidationErrorDB(error)
        }
        if(error.name === 'JsonWebTokenError'){
            error = handleJWTError(error)
        }
        if(error.name === 'TokenExpiredError'){
            error = handleJWTExpiredError(error)
        }
        sendErrorPROD(error, res,req)
    }
}