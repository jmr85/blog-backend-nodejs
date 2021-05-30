'use strict'

var express = require('express');

var ArticleController = require('../controllers/article');

var router = express.Router();

// Configurar el modulo connect multiparty 
var multipart = require('connect-multiparty');
// middleware se ejecuta antes del metodo del controller
var md_upload = multipart({ uploadDir: './upload/articles'});

// Rutas de prueba
router.post('/datos-persona', ArticleController.datosPersona);
router.get('/test-de-controlador', ArticleController.test);

// Rutas utiles
router.post('/save', ArticleController.save)
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);


module.exports = router;
