const dotenv = require("dotenv")
dotenv.config({path:'./config.env'})
const app = require("./app")
const mongoose = require("mongoose")
// console.log(process.env.NODE_ENV);

const DB= process.env.DATABASE.replace("<password>",process.env.DATABASE_PASSWORD)
mongoose.connect(DB).then(con=>{
    // console.log(con.connections)
    console.log('DB connected successfully!')
})


const port = process.env.PORT || 3000
app.listen(3000,()=>{
    console.log("Listening on port 3000")
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });