const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    offerName: {
        type: String,
        required: true
    },
    
    categoryName: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    discountType: {
        type: String,
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive:{
        type: Boolean,
        default:false
    }
});

const categoryOffer = mongoose.model('categoryOffer', OfferSchema);

module.exports = categoryOffer;
