const { Router } = require("express");
const router = Router();
const {
    login,
    registerUser
} = require('../controllers/auth');


router.post('/login', login );
router.post('/register', registerUser);





module.exports = router;