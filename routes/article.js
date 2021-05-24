'use strict'

var express = require('express');

var ArticleController = require('../controllers/article');

var router = express.Router();

// Rutas de prueba
router.post('/datos-persona', ArticleController.datosPersona);
router.get('/test-de-controlador', ArticleController.test);

// Rutas utiles
router.post('/save', ArticleController.save)
router.get('/articles', ArticleController.getArticles);

module.exports = router;
