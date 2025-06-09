const mongoose  = require('mongoose');

const categeryschema = mongoose.Schema({
    categoryname:{
        type:String,
        require:true,
        unique:true  
    },
    description:{
        type:String,
        require:true
    },
    categeoryOffers:{
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true
    }
    
    

},
{
    timestamps: true // <--- Make sure this is present in your Categeory schema definition
})

module.exports=mongoose.model("Category",categeryschema)