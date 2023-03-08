"use strict";
const RouterProfile = require('express');
const profileController = require('./profileController');
const profileRouter = new RouterProfile();
const profileEndPoints = {
    updateUser: '/update',
    resetPassword: '/resetPassword',
};
profileRouter.put(profileEndPoints.updateUser, profileController.updateUser);
profileRouter.put(profileEndPoints.resetPassword, profileController.resetPassword);
module.exports = profileRouter;
