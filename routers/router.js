const express = require('express')
const router = express.Router()
const controller = require('../controlers/controller')
const { body} = require('express-validator');


//get all
router.get('/', controller.getAll);
//add user
router.get('/add/user', controller.addUser)

//router.post('/',controller.create)
//
router.post('/register',
    body('first_name').isLength({ min: 2 }),
    body('last_name').isLength({ min: 2 }),
    controller.create
)

router.post('/get/santa', controller.getSanta)

router.post('/shuffle', controller.shuffle2)
//
router.get('/info', controller.info)

router.get('/delete', controller.delete)

module.exports = router