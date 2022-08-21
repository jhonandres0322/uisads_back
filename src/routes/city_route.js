const { Router } = require('express');

const router = Router();

const { createCity,  getCities, getCityById } = require('../controllers/city_controller');

router.get('/',getCities);
router.post('/', createCity);
router.get('/:id', getCityById)

module.exports = router;