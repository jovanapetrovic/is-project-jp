const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponsSchema = new Schema({
    book: String,
    link: String
});

mongoose.model('coupon', couponsSchema);