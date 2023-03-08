import express from 'express'
import { updateUser, deleteUser, showUser } from '../controllers/UserController.js'

var router = express.Router()

router.get('/user/show/:id', showUser)
router.put('/user/update/:id', updateUser)
router.delete('/user/delete/:id', deleteUser)

export default router