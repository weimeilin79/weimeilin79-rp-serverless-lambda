const express = require('express');
const axios = require('axios');
const PropertiesReader = require('properties-reader');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/config', (req, res) => {
    const properties = PropertiesReader('config.properties');
    res.json({
      apiBaseUrl: properties.get('apiBaseUrl')
    });
  });