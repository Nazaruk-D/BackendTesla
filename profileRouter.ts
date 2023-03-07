const RouterProfile = require('express')
const profileController = require('./profileController')
const profileRouter = new RouterProfile()

const profileEndPoints = {
    updateUser: '/:id',
}

profileRouter.put(profileEndPoints.updateUser, profileController.updateUser)

module.exports = profileRouter