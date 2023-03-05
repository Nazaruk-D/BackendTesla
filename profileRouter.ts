const RouterProfile = require('express')
const profileController = require('./profileController')
const profileRouter = new RouterProfile()

const profileEndPoints = {
    registration: '/me',
}

profileRouter.get(profileEndPoints.registration, profileController.registration)

module.exports = profileRouter