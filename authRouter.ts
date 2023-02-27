const Router = require('express')
const controller = require('./authController')
const router = new Router()

const endPoints = {
    me: '/me',
    registration: '/register',
    login: '/login',
    logout: '/logout'
}

router.get(endPoints.me, controller.me)
router.post(endPoints.login, controller.login)
router.post(endPoints.registration, controller.registration)
router.post(endPoints.logout, controller.logout)

module.exports = router