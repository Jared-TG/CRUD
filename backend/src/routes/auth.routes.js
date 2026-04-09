const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const VerifyToken = require("../middlewares/auth.middleware");
const verifyToken = require("../middlewares/auth.middleware");

router.post('/login', authController.login);
router.post('/register',authController.register);
router.get('/users', authController.getUsers);
router.get('/users/:id', authController.getUserById);
router.put('/users/:id', authController.updateUser);
router.delete('/users/:id', authController.deleteUser);
module.exports = router;