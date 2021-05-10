'use strict'

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
    }
};// end controller

module.exports = controller;