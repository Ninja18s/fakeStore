const mongoose = require('mongoose');
const {Schema} = mongoose;


const productSchema = new Schema({
    title :{
        type : String,
        required : true,
        trim : true,
        lowercase :true,
        unique:true

    },
    price : {
        type : Number,
        required: true, 
        trim : true,
        validate(value){
            if(value <= 0){
                throw new Error('enter positive price');
            }
        }
    },
    description : {
        type : String,
        required : true,
        trim : true,
        lowercase :true
    },
    category :{
        type : String,
        required : true,
        trim : true,
        lowercase :true
    },
    productImage: {
        type: Buffer
    }
}, {
    timestamps:true
});


const Product = mongoose.model('product', productSchema);

module.exports = Product;