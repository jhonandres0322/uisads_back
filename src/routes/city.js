const { Router } = require('express');

const router = Router();

const { createCity,  getCities } = require('../controllers/city');

router.get('/',getCities);
router.post('/', createCity);

module.exports = router;