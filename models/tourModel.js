const mongoose = require("mongoose")
const slugify = require("slugify")
const validator = require("validator")
const User = require("./userModel")
const tourSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter the name"],
        unique:true,
        trim:true,
        maxlength:[40, 'A tour must have less than or equal to 40 characters'],
        minlength:[10, 'A tour must have greater than or equal to 10 characters'],
        //third partry string validator
        // validate:[validator.isAlpha,'A tour must containe only characters']
    },
    slug : String,
    duration:{
        type:Number,
        required:[true, "A tour must have duration"]
    },
    maxGroupSize:{
        type:Number,
        required:[true,"A tour must have a size"]
    },
    difficulty:{
        type:String,
        required:[true, "A tour must have difficulty"],
        enum : {
            values : ['easy', 'medium', 'difficult'],
            message : 'Difficulty is either: easy or medium or difficult'
        }
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min: [1, "Rating should be above 1"],
        max: [5, "Rating should be below 6"]
    },
    ratingsQuantity:{
        type:Number,
        default:4.5,
        
    },
    price:{
        type:Number,
        required:[true, "A tour must have price"]
    },
    priceDiscount: {
        type : Number,
        //this only points to current doc to NEW document creation//
        validate:{
            validator: function(val){
                return val < this.price;
            },
        message : 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary:{
        type:String,
        trim:true,
        required:[true, 'A tour must have summary']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,"A tour must have image cover"]
    },
    image:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date] ,
    secretTour : {
        type : Boolean,
        default : false
    },
    startLocation:{
        //GeoJson
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    location:[{
        type:{
            type:String,
            default:"Point",
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
    
    }],
    guides:Array
},{
    toJSON :{ virtuals : true},
    toObject : { virtuals : true}
})

tourSchema.virtual('durationWeek').get(function(){
    return this.duration / 7
});

//DOCUMENT MIDDLEWARE : runs before save() and create() not inset() or insertMany()//

tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower : true})
    next()
})
tourSchema.pre('save',async function(next){
    const guidePromises = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(guidePromises)
    next()
})
// tourSchema.pre('save',function(next){
//     console.log('Will save document....')
//     next()
// })

// tourSchema.post('save', function(doc, next){
//     console.log(doc)
//     next()
// })

//QUERY MIDDLEWARE : It allows us to run before and after the query is executed
tourSchema.pre(/^find/, function(next){
    this.find({secretTour : {$ne : true}})
    next()
})

//AGGREGATE MIDDLEWARE : It allows us to run before and after the aggregate is executed
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour : {$ne : true}}})
    next()
})



const Tour = mongoose.model('Tour' ,tourSchema)

module.exports = Tour