const express = require("express")

const app = express();

const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")
const AppError = require("./utils/appError")

//Global Middleware
//1. set security http header
app.use(helmet())
//2. limit request for same API
const limiter = rateLimit({
    max : 100,
    windowMs: 60 *60* 1000,
    message: "To many request from this IP. Please try again in an hour!"
})
app.use('/api', limiter)
//Use ia a middleware function. Middleware functions genrally used to modify incoming request data
// req -> middleware -> response
//3. body parser, read data from the body into req.body
app.use(express.json({limit : '10kb'}))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//serving static files
app.use(express.static(`${__dirname}/public`))

//Route
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.all('*', (req,res,next)=>{
    next(new AppError(`Can't find route ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app 