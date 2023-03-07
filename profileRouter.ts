const RouterProfile = require('express')
const profileController = require('./profileController')
const profileRouter = new RouterProfile()

const profileEndPoints = {
    updateUser: '/update',
}

profileRouter.put(profileEndPoints.updateUser, profileController.updateUser)

module.exports = profileRouter