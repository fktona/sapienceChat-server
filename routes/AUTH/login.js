const {login} = require('../../controller/AUTH/login');
const router = require('express').Router();

router.post('/login' , login)

module.exports = router