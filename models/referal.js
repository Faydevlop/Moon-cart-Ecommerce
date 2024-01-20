const mongoose = require('mongoose')

const referalSchema = new mongoose.Schema({
referralId:[
    {
        type:String,
        unique:true
    }
],
referrallink:{
    type:String,
    unique:true
},
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users'
},
creatAt:{
    type:Date,
    default:Date.now()
}
})
const Referral = mongoose.model("Referrals",referalSchema);
module.exports=Referral;    