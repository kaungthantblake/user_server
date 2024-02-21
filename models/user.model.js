const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please enter name']
    },
    email: {
        type: String,
        require: [true, 'Please enter email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        require: [true, 'Please enter name'],
        minlength: [6, 'Passwords must be at least 6 characters']
    },
    role: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.SignAccessToken = function () {
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN, 
        {expiresIn: '1d'}
    )
}

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;