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
        min: 0,
        max: 100,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true
    }
    

})

module.exports=mongoose.model("Category",categeryschema)