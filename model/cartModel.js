const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');


const cartSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'product'

        },
        title: {
            type: String,
            required: true,
            trim: true,
            lowercase: true

        },
        price: {
            type: Number,
            required: true,
            validate(value) {
                if (value <= 0) {
                    throw new Error('Price should be positive ')
                }
            }

        },
        quantity: {
            type: Number,
            required: true,
            validate(value) {
                if (value < 0) {
                    throw new Error('Quantity should be positive and non-decimal value')
                }
            }
        },
        total : {
            type : Number,
            required: true,
            validate(value) {
                if (value < 0 ) {
                    throw new Error('total value should be positive')
                }
            }
            
        }

    }]
    ,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique:true,
        ref: 'user'
    }
});


const Cart = mongoose.model('cart', cartSchema);


module.exports = Cart;


