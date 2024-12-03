const express = require('express');

const weatherController = require('./controllers/weatherController');
const temperatureGraphController = require('./controllers/temperatureGraphController');

const router = express.Router();

router.get('/', (_, res) => {
  res.send({ message: 'Hello, World!' });
});
router.get('/weather', weatherController);
router.get('/temperature-graph', temperatureGraphController);

module.exports = router;
