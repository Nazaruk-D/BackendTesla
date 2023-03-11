const RouterProfile = require('express')
const profileController = require('./profileController')
const profileRouter = new RouterProfile()

const profileEndPoints = {
    updateUser: '/update',
    resetPassword: '/resetPassword',
    users: '/users'
}

profileRouter.put(profileEndPoints.updateUser, profileController.updateUser)
profileRouter.put(profileEndPoints.resetPassword, profileController.resetPassword)
profileRouter.get(profileEndPoints.users, profileController.getUsers)

module.exports = profileRouter