'use strict'

var validator = require('validator');

var fs = require('fs');
var path = require('path');

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
    },

    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js (hecho)

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });
        
        }else{
             // Si todo es valido, sacando id de la url
             var articleId = req.params.id;

             if(articleId){
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {

                    if(err || !articleUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de articulo !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
             }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
             }
            
        }   
    }, // end upload file
};// end controller

module.exports = controller;