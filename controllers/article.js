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
    },
    getArticles: (req, res) => {

        var query =  Article.find({});

        var last = req.params.last;
        console.log(last);

        if(last || last != undefined){
            query.limit(5);
        }
        // find
        query.sort('-_id').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos !!!'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        }); 
    },
    getArticle: (req, res) => {
        // Recoger el id de la url 
        var articleId = req.params.id;
        // Comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el artculo !!!'
            });
        }
        // Buscar el articulo
        Article.findById(articleId, (err, article) => {
            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo !!!'
                });
            }
            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },
    update: (req, res) => {
        // tomar el id de articulo que viene por la url
        var articleId = req.params.id;
        // tomar los datos (parametros) que llegan por put
        var params = req.body;
        // validar datos 
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);    
        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }
        if(validate_title && validate_content){
            // Hacer un Find and Update
            Article.findByIdAndUpdate({_id: articleId}, params, {new: true}, (err, articleUdate) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }
                if (!articleUdate){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo !!!'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUdate
                });
            });
        }else{
            // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta !!!'
            });
        }
        
    },
    delete: (req, res) => {
              // Recoger el id de la url
              var articleId = req.params.id;

              // Find and delete
              Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
                  if(err){
                      return res.status(500).send({
                          status: 'error',
                          message: 'Error al borrar !!!'
                      });
                  }
      
                  if(!articleRemoved){
                      return res.status(404).send({
                          status: 'error',
                          message: 'No se ha borrado el articulo, posiblemente no exista !!!'
                      });
                  }
      
                  return res.status(200).send({
                      status: 'success',
                      article: articleRemoved
                  });
      
              }); 
    }
};// end controller

module.exports = controller;