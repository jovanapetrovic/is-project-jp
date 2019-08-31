const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookDemandSchema = new Schema({
    book: String,
    counter: { type: Number, default: 1 }
});

mongoose.model('bookDemand', bookDemandSchema);