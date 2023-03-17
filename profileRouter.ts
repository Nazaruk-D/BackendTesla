const RouterProfile = require('express')
const profileController = require('./profileController')
const profileRouter = new RouterProfile()

const profileEndPoints = {
    updateUser: '/update',
    resetPassword: '/resetPassword',
    users: '/users',
    deleteUser: '/delete',
    updateScheduleStatus: '/updateScheduleStatus',
    schedules: '/schedules',
}

profileRouter.put(profileEndPoints.updateUser, profileController.updateUser)
profileRouter.put(profileEndPoints.updateScheduleStatus, profileController.updateScheduleStatus)
profileRouter.put(profileEndPoints.resetPassword, profileController.resetPassword)
profileRouter.get(profileEndPoints.users, profileController.getUsers)
profileRouter.get(profileEndPoints.schedules, profileController.getSchedules)
profileRouter.delete(profileEndPoints.deleteUser, profileController.deleteUser)

module.exports = profileRouter