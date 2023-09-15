const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto')
const {promisify} = require('util')
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')

const signToken = (id)=>{
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}



const createSendToken = (user,statusCode, res)=>{
  const token = signToken(user._id);
  const cookieOptions = {
    expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    
    httpOnly:true
  }
  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions) 
  
  user.password = undefined
  res.status(statusCode).json({ 
    status: 'success',
    token, 
  })
}
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt : req.body.passwordChangedAt
  });
  createSendToken(newUser, 201, res)
  // const token = signToken(newUser._id);
  // res.status(201).json({
  //   status: 'success',
  //   token, 
  //   data: { newUser },
  // });
});

exports.login = catchAsync(async(req, res, next)=>{
    const {email, password} = req.body
    //1)check if email and password exist
    if (!email || !password ){
       return next(new AppError(`please provide email and password`,404))
    }
    //2)check if user is exist && also compare the password
    const user = await User.findOne({email}).select('+password')
    // console.log(user)
    if( !user || !(await user.correctPassword(password, user.password))){
      return next(new AppError(`Incorrect email or password`,401))
    }
    console.log(user);
    //3) If everything is ok send token to client
    createSendToken(user, 200, res)
    // const token = signToken(user._id)
    // res.status(200).json({
    //     status : 'Success',
    //     token
    // })
})

exports.protect = catchAsync(async (req,res,next)=>{
  //1) Getting token and check of it's there
      let token
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
      }
      if(!token){
       return next(new AppError(`You are not logged in! please login to access`,401))
      }
  //2) Verification token
      let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      console.log(decoded);
  //3) check if the user is exist
      const currentUser = await User.findById(decoded.id)
      if(!currentUser){
        return next(new AppError(`The user belonging to this token is no longer exist`,401))
      }
  //4) check if user changed password after token was issued//
      if(currentUser.changePasswordAfter(decoded.iat)){
        next(new AppError(`Password has been changed recently, Please login again`,401))
      }
  // Grant access to protected route
  req.user = currentUser
  next()
})

exports.restrictTo = (...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new AppError(`you do not have permssion to access this resource`,403))
    }
    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
exports.resetPassword =catchAsync(async (req,res,next)=>{
  //get user based on the token
  const hashtoken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user =await User.findOne({passwordResetToken : hashtoken, passwordResetExpires : {$gt : Date.now()}})
  console.log(user);
  //if token is not expire and there is user, set the password
  if(!user){
    return next(new AppError(`Token as expired`,400))
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined;
  await user.save({validateModifiedOnly: true});
  //Update changePasswordAt property for the user

  //log the user in, send JWT
  createSendToken(user, 201, res)
  // const token = signToken(user._id);
  // res.status(201).json({
  //   status: 'success',
  //   token
  // });
})

exports.updatePassword = catchAsync(async(req, res, next)=>{
    //1.Get user from collection
        const user = await User.findById(req.user.id).select('+password')
        console.log(user);
        
    //2.check if the POSTed current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
      return next(new AppError(`your current password is wrong`,401))
    }
    //3.If so update password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    //4.send JWT token
    createSendToken(user, 200, res)
})