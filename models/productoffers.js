const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    offerName: {
        type: String,
        required: true
    },
    
    productName: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
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

const productOffer = mongoose.model('productOffer', OfferSchema);

module.exports = productOffer;
