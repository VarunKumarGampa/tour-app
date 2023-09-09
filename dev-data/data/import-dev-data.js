const dotenv = require("dotenv")
dotenv.config({path:'./config.env'})
const mongoose = require("mongoose")
const fs = require("fs")
const Tour = require('./../../models/tourModel')
const { isUtf8 } = require("buffer")
// console.log(process.env.NODE_ENV);

const DB= process.env.DATABASE.replace("<password>",process.env.DATABASE_PASSWORD)
mongoose.connect(DB).then(con=>{
    // console.log(con.connections)
    console.log('DB connected successfully!')
})

//Read data file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))

//import data into Database
const importData = async()=>{
    try {
        await Tour.create(tours)
        console.log("Data successfully loaded!")
        process.exit()
    } catch (error) {
        console.log(error)
    }
} 

//Delete data from Database
const deleteData =  async()=>{
    try {
        await Tour.deleteMany()
        console.log("Data deleted successfully")
        process.exit()
    } catch (error) {
        console.log(error)
    }
} 

if(process.argv[2]==="--import"){
    importData();
}
else if(process.argv[2]==="--delete")
{
    deleteData()
}