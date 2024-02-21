const express = require('express');
const userController = require('../controllers/user.controller');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/me', isAuthenticated, userController.getUserInfo);

router.patch('/update-user-info', isAuthenticated, userController.updateUserInfo);

router.patch('/update-user-password', isAuthenticated, userController.updateUserPassword);

router.patch('/update-user-role', isAuthenticated, authorizeRoles([1]), userController.updateUserRole);

router.delete('/delete-one-user/:id', isAuthenticated, authorizeRoles([1]), userController.deleteOneUser);

router.get('/get-all-users', isAuthenticated, authorizeRoles([1]), userController.getAllUsers )

module.exports = router;