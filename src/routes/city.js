const { Router } = require('express');

const router = Router();

const { createCity } = require('../controllers/city');


router.post('/', createCity);

module.exports = router;