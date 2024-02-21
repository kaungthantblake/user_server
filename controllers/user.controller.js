const UserModel = require('../models/user.model')
const CustomError = require('../utils/CustomError')
const asyncErrorHandler = require('../utils/asyncErrorHandler')

exports.register = asyncErrorHandler(async (req, res, next) => {
    const {name, email, password} = req.body;
    const isEmailExists = await UserModel.findOne({email});
    if(isEmailExists) {
        return next(new CustomError('Email already exists', 400))
    }
    const newUser = await UserModel.create({name, email, password});

    res.status(201).json({
        success: true,
        newUser
    })
})

exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password} = req.body;
    if(!email || !password) {
        return next(new CustomError('Enter email and password', 400))
    }

    const user = await UserModel.findOne({email});
    if(!user) {
        return next(new CustomError('Invalid Email', 403))
    }
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        return next(new CustomError('Invalid Password', 403))
    }

    const accessToken = await user.SignAccessToken();

    res.status(201).json({
        success: true,
        user,
        accessToken
    })
})

exports.getUserInfo = asyncErrorHandler(async (req, res, next) => {
    const id = req.user.id;
    const user = await UserModel.findById(id);
    if(!user) {
        return next(new CustomError('User Not Found!', 404))
    }

    res.status(201).json({
        success: true,
        user,
    })
})

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const users = await UserModel.find();
    res.status(201).json({
        success: true,
        users,
    })
})


exports.updateUserInfo = asyncErrorHandler(async (req, res, next) => {
    const id = req.user._id;
    const { name, email } = req.body;
    const user = await UserModel.findByIdAndUpdate(id, {name, email}, {new: true});
    if(!user) {
        return next(new CustomError("User not found!", 404))
    }        
    res.status(200).json({
        success: true,
        user
    })
});

exports.updateUserPassword = asyncErrorHandler(async (req, res, next) => {
    const id = req.user._id;
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword) {
        return next(new CustomError("Please enter old and new password!", 400));
    }

    const user = await UserModel.findById(id);
    const isPasswordMatch = await user?.comparePassword(oldPassword);
    if(!isPasswordMatch) {
        return next(new CustomError("Invalid old password!", 404));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        user,
    })
});

exports.updateUserRole = asyncErrorHandler(async (req, res, next) => {
    const {id, role} = req.body;
    const user = await UserModel.findByIdAndUpdate(id, {role}, {new: true});
    if(!user) {
        return next(new CustomError("User not found!", 404))
    }
    res.status(201).json({
        success: true,
        user,
    });
});

exports.deleteOneUser = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    if(!user) {
        return next(new CustomError("User not found!", 404));
    }
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    }); 
});