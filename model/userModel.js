const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Cart = require('./cartModel');



const userSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is not valid');
            }
        }

    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {

        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    address: {
        houseNumber: {
            type: String,
            required: true,
            trim: true
        },
        street: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        city: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        state: {
            type: String,
            required: true,
            trim: true,
            lowercase: true

        },
        country: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        zipCode: {
            type: Number,
            trim: true,

        }
        // letitude :{

        // },
        // longitude
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            const pat = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$");

            if (value.toLowerCase().includes('password')) {
                throw new Error('password can not be password');
            } else if (!pat.test(value)) {
                throw new Error('regexp  wroking')
            }
        }
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 10,


    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

},
    {
        timestamps: true
    })

userSchema.virtual('cart', {
    ref: 'cart',
    localField: '_id',
    foreignField: 'userId'

})

userSchema.methods.generateToken = async function () {
    const user = this;



    const token = jwt.sign({
        _id: user._id.toString(),
        user,
        role: user.role
    }, process.env.jwt_key);

    user.tokens = user.tokens.concat({ token })


    await user.save();
    return token
}

userSchema.methods.toJSON = function () {
    const user = this;

    const userObj = user.toObject();

    delete userObj.tokens;
    delete userObj.password;


    return userObj;
}

userSchema.statics.removeCart = async(user) => {

    try{
        console.log("asdfasdf");

        const cart = await Cart.remove({ userId: user._id });
        
        if(!cart){
            
            return false
        }
        return true;

        
    } catch(e){
        console.log(e);
    }
    

}

userSchema.statics.findByCredentials = async function (email, password) {

    const user = await this.findOne({ email });

    if (!user) {
        throw new Error('unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('unable to login');
    }

    return user;

}

userSchema.pre('save', async function (next) {

    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next();

})

const User = mongoose.model('user', userSchema);


module.exports = User;