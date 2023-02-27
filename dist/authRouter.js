"use strict";
const Router = require('express');
const controller = require('./authController');
const router = new Router();
const { check } = require("express-validator");
const endPoints = {
    me: '/me',
    registration: '/register',
    login: '/login',
    logout: '/logout'
};
router.get(endPoints.me, controller.me);
router.post(endPoints.login, [
    check("email", "Email пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быть больше 3х символов").isLength({ min: 3 }),
], controller.login);
router.post(endPoints.registration, [
    check("firstName", "Имя пользователя не может быть пустым").notEmpty(),
    check("lastName", "Фамилия пользователя не может быть пустым").notEmpty(),
    check("email", "Email пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быть больше 3х символов").isLength({ min: 3 }),
], controller.registration);
router.post(endPoints.logout, controller.logout);
module.exports = router;
