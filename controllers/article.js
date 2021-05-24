'use strict'

var validator = require('validator');
var Article = require('../models/articles');

var controller = {
    datosPersona: (req, res) => {
        var hola = req.body.hola;
        
        return res.status(200).send({
            nombre: 'Juan',
            apellido: 'Ruiz',
            hola
        });
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de articles'
        });
    },
    save: (req, res) => {
        //1. Tomar los parametros por post
        var params = req.body;
        console.log(params);
        //2. Validar datos (con la libreria validator)
        try {
            var validate_title = !validator.isEmpty(params.title);// cuando no esta vacio
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(200).send({
                status: 'error',
                article: 'Faltan datos por enviar'
            });
        }
        if (validate_title && validate_content) {
            //3. Crear el objeto a guardar
            var article = new Article();
            //4. Asignar valores al objeto
            article.title =  params.title;
            article.content =  params.content;
            article.image =  null;

            //5. Guardar el articulo
            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!!'
                    });
                }
                  //6. Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            })
          
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos !!!'
            });
        }
        return res.status(200).send({
            article: params
        });
    }
};// end controller

module.exports = controller;