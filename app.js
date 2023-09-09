const express = require("express")

const app = express();

const morgan = require('morgan')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")
const AppError = require("./utils/appError")


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