const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { log } = require('console')

const userSchema = mongoose.Schema({
 name : {
    type : String,
    required : [true, 'Please enter the name']
},
 email : {
    type: String,
    required : [true, 'Please enter email id'],
    unique : true,
    lowercase : true,
    validate : [validator.isEmail, 'please enter the vaild email']
},
 photo : {
    type: String,
    default: 'default.jpg'
},
role:{
    type: String,
    enum : ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
},
password : {
    type : String,
    required : [true, 'Please enter password'],
    minlength : 8,
    select : false
},
 passwordConfirm :{
    type : String,
    required : [true, 'please enter password again'],
    validate : {
        //This only works on CREATE and SAVE!! validation only works in create method not on update
        validator : function(val){
            return val === this.password
        },
        message : 'Passwords are not same'
    },
    
},
passwordChangedAt : {
    type : Date,
    // required : [true, 'please!!'], 
},
passwordResetToken : String,
passwordResetExpires : Date,
active :{
    type : Boolean,
    default: true,
    select : false
}
})

userSchema.pre('save', async function(next){
    //only run this if the password was modified
    if(!this.isModified('password')) return next()

    //hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    //Deleting passwordConfirm field as it is only used for validation not to persist on the database
    this.passwordConfirm = undefined
})
//query middleware
userSchema.pre(/^find/,function(next){
    //this keyword points to query object
    this.find({active:{$ne : false}})
    next()
})

//below methods are instance methods
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changePasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() /1000,10)
        console.log(changeTimeStamp, JWTTimestamp)
        return changeTimeStamp > JWTTimestamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    console.log(`resetoken: ${resetToken}`)
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    console.log(this.passwordResetToken, this.passwordResetExpires);
    return resetToken
}

userSchema.pre("save",function(next){
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now()
    return next()
})
const User = mongoose.model('User', userSchema)

module.exports = User