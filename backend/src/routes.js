const express = require('express');

const weatherController = require('./controllers/weatherController'); 

const router = express.Router();

router.get('/', (_, res) => {
    res.send({ message: 'Hello, World!' });
});
router.get('/weather', weatherController);

module.exports = router;
