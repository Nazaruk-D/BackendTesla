"use strict";
const RouterProfile = require('express');
const profileController = require('./profileController');
const profileRouter = new RouterProfile();
const profileEndPoints = {
    updateUser: '/update',
    resetPassword: '/resetPassword',
    users: '/users',
    deleteUser: '/delete'
};
profileRouter.put(profileEndPoints.updateUser, profileController.updateUser);
profileRouter.put(profileEndPoints.resetPassword, profileController.resetPassword);
profileRouter.get(profileEndPoints.users, profileController.getUsers);
profileRouter.delete(profileEndPoints.deleteUser, profileController.deleteUser);
module.exports = profileRouter;
