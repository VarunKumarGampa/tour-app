const express = require("express")

const app = express();

const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")
const AppError = require("./utils/appError")

const limiter = rateLimit({
    max : 100,
    windowMs: 60 *60* 1000,
    message: "To many request from this IP. Please try again in an hour!"
})
app.use('/api', limiter)
//Use ia a middleware function. Middleware functions genrally used to modify incoming request data
// req -> middleware -> response
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


app.use(express.static(`${__dirname}/public`))
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.all('*', (req,res,next)=>{
    next(new AppError(`Can't find route ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app 